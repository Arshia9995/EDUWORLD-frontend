import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, Upload, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../../config/constants';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  course: string;
  duration?: string;
}

const InstructorEditLesson: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  // Redirect if courseId is not provided
  if (!courseId) {
    toast.error('Course ID is missing.');
    navigate('/instructorcourses');
    return null;
  }

  // Validate video file
  const validateVideoFile = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        reject(new Error('Video file size must be less than 50MB'));
        return;
      }

      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        reject(new Error('Invalid video format. Please use MP4, MOV, or AVI'));
        return;
      }

      const url = URL.createObjectURL(file);
      const videoElement = document.createElement('video');

      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };

      videoElement.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Invalid video file or format not supported'));
      };

      videoElement.src = url;
      videoElement.load(); // Explicitly trigger loading
    });
  };

  // Upload video to S3
  const uploadToS3 = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const { data } = await axios.post(
        `${baseUrl}/users/videoget-s3-url`,
        {
          fileName: file.name,
          fileType: file.type,
          folder: 'videos',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (!data.url) {
        throw new Error('Failed to get S3 URL');
      }

      await axios.put(data.url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploading(false);
      return { permanentUrl: data.downloadUrl }; // Return the permanent S3 URL
    } catch (error: any) {
      setUploading(false);
      console.error('S3 upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload video to S3');
    }
  };

  // Fetch lessons for the course
  const fetchLessons = async () => {
  try {
    setLoading(true);
    const response = await api.get(`/users/getlessonbycourseid/${courseId}`, {
      withCredentials: true,
    });

    if (response.status !== 200 || !response.data.lessons) {
      throw new Error(response.data.message || 'Failed to fetch lessons');
    }

    const fetchedLessons = response.data.lessons;
    
    setLessons(fetchedLessons);
    if (fetchedLessons.length > 0) {
      setSelectedLesson(fetchedLessons[0]);
      setVideoPreviewUrl(fetchedLessons[0].video || null);
    } else {
      setSelectedLesson(null);
      setVideoPreviewUrl(null);
    }
  } catch (err: any) {
    console.error('Error fetching lessons:', err);
    setError(err.response?.data?.message || 'Failed to load lessons. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Load lessons on component mount
  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // Cleanup preview URL on unmount or when video changes
  useEffect(() => {
    return () => {
      if (videoPreviewUrl && video) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl, video]);

  // Initial form values based on selected lesson
  const initialValues = {
    title: selectedLesson?.title || '',
    description: selectedLesson?.description || '',
    duration: selectedLesson?.duration || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Lesson title is required'),
    description: Yup.string().required('Description is required'),
    duration: Yup.string().optional(),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    if (!selectedLesson) {
      toast.error('Please select a lesson to edit');
      return;
    }

    try {
      let videoUrl = selectedLesson.video;
      if (video) {
        const { permanentUrl } = await uploadToS3(video);
        videoUrl = permanentUrl;
        // Update preview URL only after successful upload
        if (videoPreviewUrl && video) {
          URL.revokeObjectURL(videoPreviewUrl); // Clean up old preview
        }
        setVideoPreviewUrl(videoUrl);
      }

      const lessonData = {
        title: values.title,
        description: values.description,
        video: videoUrl,
        course: courseId,
        duration: values.duration || undefined,
      };

      const response = await api.put(`/users/updatelesson/${selectedLesson._id}`, lessonData, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to update lesson');
      }

      toast.success('Lesson updated successfully');

      const updatedLessons = lessons.map((lesson) =>
        lesson._id === selectedLesson._id ? { ...lesson, ...lessonData } : lesson
      );
      setLessons(updatedLessons);
      setSelectedLesson({ ...selectedLesson, ...lessonData });
      setVideo(null);
      setVideoError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error updating lesson:', err);
      setError(err.response?.data?.message || 'Failed to update lesson. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) {
      toast.error('No lesson selected to delete');
      return;
    }

    try {
      setIsDeleting(true);
      const response = await api.delete(`/users/deletelesson/${selectedLesson._id}`, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete lesson');
      }

      toast.success('Lesson deleted successfully');
      
      const updatedLessons = lessons.filter(lesson => lesson._id !== selectedLesson._id);
      setLessons(updatedLessons);
      
      if (updatedLessons.length > 0) {
        setSelectedLesson(updatedLessons[0]);
        setVideoPreviewUrl(updatedLessons[0].video || null);
      } else {
        setSelectedLesson(null);
        setVideoPreviewUrl(null);
      }
      
      setDeleteConfirmation(null);
    } catch (err: any) {
      console.error('Error deleting lesson:', err);
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        await validateVideoFile(file);
        // Clean up previous preview URL if it exists and is a local blob
        if (videoPreviewUrl && video) {
          URL.revokeObjectURL(videoPreviewUrl);
        }
        const url = URL.createObjectURL(file);
        setVideo(file);
        setVideoPreviewUrl(url);
        setVideoError(null);
      }
    } catch (err: any) {
      setVideoError(err.message);
      setVideo(null);
      setVideoPreviewUrl(selectedLesson?.video || null); // Revert to original
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearVideo = () => {
    if (videoPreviewUrl && video) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideo(null);
    setVideoPreviewUrl(selectedLesson?.video || null);
    setVideoError(null);
    setUploadProgress(0);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (videoPreviewUrl && video) {
      URL.revokeObjectURL(videoPreviewUrl); // Clean up preview of unsaved video
    }
    setSelectedLesson(lesson);
    setVideo(null);
    setVideoPreviewUrl(lesson.video || null);
    setVideoError(null);
    setDeleteConfirmation(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`flex-1 min-h-screen transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
      >
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Edit Lessons</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Lesson Content</h2>
            <p className="text-gray-600 mt-1">Update the details of your lessons below</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-gray-600">Loading lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Lessons Found</h3>
              <p className="text-gray-600 mb-6">Add lessons to this course first.</p>
              <button
                onClick={() => navigate(`/instructor/addlesson`, { state: { courseId } })}
                className="py-2.5 px-6 rounded-lg bg-blue-900 text-white hover:bg-blue-700 transition-colors"
              >
                Add Lesson
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lessons</h3>
                <ul className="space-y-2">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson._id}
                      className={`p-3 rounded-lg ${
                        selectedLesson?._id === lesson._id
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div 
                          className="flex-1 cursor-pointer" 
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          {lesson.title}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLesson(lesson);
                            setDeleteConfirmation(lesson._id);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded-full"
                          title="Delete lesson"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-3">
                {selectedLesson && (
                  <>
                    {deleteConfirmation === selectedLesson._id && (
                      <div className="bg-white rounded-xl shadow-sm border border-red-300 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-4">
                          Are you sure you want to delete the lesson "<strong>{selectedLesson.title}</strong>"? 
                          This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmation(null)}
                            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteLesson}
                            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                Delete Lesson
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                      enableReinitialize
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Edit Lesson: {selectedLesson.title}
                              </h3>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmation(selectedLesson._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
                                title="Delete lesson"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>

                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-base font-medium text-gray-700 mb-2">Lesson Video</h4>
                                  {!videoPreviewUrl ? (
                                    <div
                                      onClick={handleUploadClick}
                                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 h-64"
                                    >
                                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                      <p className="text-gray-700 font-medium mb-1">Click to upload video</p>
                                      <p className="text-gray-500 text-sm text-center max-w-md">
                                        MP4, MOV, or AVI formats (max 50MB)
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <div className="relative rounded-lg overflow-hidden bg-gray-800 border border-gray-200">
                                        <video
                                          key={videoPreviewUrl} // Force re-render when URL changes
                                          src={videoPreviewUrl}
                                          controls
                                          className="w-full h-auto max-h-[240px] object-contain"
                                          onError={(e) => {
                                            console.error('Video error:', e);
                                            setVideoError(
                                              'Error loading video. It may not be accessible or supported.'
                                            );
                                          }}
                                          onLoadedData={() => setVideoError(null)} // Clear error on successful load
                                        />
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-white text-sm font-medium truncate max-w-[200px]">
                                              {video?.name || 'Current Video'}
                                            </span>
                                            <button
                                              className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                              onClick={clearVideo}
                                              type="button"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-center">
                                        <button
                                          type="button"
                                          onClick={handleUploadClick}
                                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                          <Upload className="h-4 w-4" />
                                          Change Video
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="video"
                                    name="video"
                                    accept="video/mp4,video/quicktime,video/x-msvideo"
                                    onChange={handleFileChange}
                                    className="hidden"
                                  />

                                  {uploading && (
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                        <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${uploadProgress}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {videoError ? (
                                    <div className="flex items-center text-red-500 text-sm bg-red-50 p-2 rounded-md">
                                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                      <span>{videoError}</span>
                                    </div>
                                  ) : video && !uploading ? (
                                    <div className="flex items-center text-green-600 text-sm bg-green-50 p-2 rounded-md">
                                      <CheckCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                      <span>Video ready for upload</span>
                                    </div>
                                  ) : null}
                                </div>

                                <div className="space-y-4">
                                  <h4 className="text-base font-medium text-gray-700 mb-2">Lesson Details</h4>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Lesson Title
                                    </label>
                                    <Field
                                      type="text"
                                      name="title"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                      placeholder="Enter a clear, descriptive title"
                                    />
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <Field
                                      as="textarea"
                                      name="description"
                                      rows={8}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                      placeholder="Describe what students will learn in this lesson"
                                    />
                                    <ErrorMessage
                                      name="description"
                                      component="div"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                  type="submit"
                                  disabled={isSubmitting || uploading}
                                  className={`py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                    isSubmitting || uploading
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      : 'bg-blue-900 text-white hover:bg-blue-700'
                                  } transition-colors`}
                                >
                                  {isSubmitting
                                    ? 'Saving...'
                                    : uploading
                                    ? `Uploading (${uploadProgress}%)`
                                    : 'Update Lesson'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigate('/instructorcourses')}
                                  className="py-2.5 px-6 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                                >
                                  Finish Editing
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorEditLesson;