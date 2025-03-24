import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, X, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../../config/constants';

function InstructorAddLesson() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [lessonCount, setLessonCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};

  // Redirect if courseId is not provided
  if (!courseId) {
    toast.error('Course ID is missing. Please add a course first.');
    navigate('/instructoraddcourse');
    return null;
  }

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
      const video = document.createElement('video');

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Invalid video file or format not supported'));
      };

      video.src = url;
    });
  };

  const uploadToS3 = async (file: File) => {
    try {
        
      setUploading(true);
      setUploadProgress(0);

      const { data } = await axios.post(
        `${baseUrl}/users/get-s3-url`,
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
      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    } catch (error: any) {
      setUploading(false);
      console.error('S3 upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload video to S3');
    }
  };

  const initialValues = {
    title: '',
    description: '',
    duration: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Lesson title is required'),
    description: Yup.string().required('Description is required'),
    duration: Yup.string().optional(),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      if (!video) {
        setVideoError('Video is required');
        toast.error('Please upload a video');
        return;
      }

      const { permanentUrl } = await uploadToS3(video);

      const lessonData = {
        title: values.title,
        description: values.description,
        video: permanentUrl,
        course: courseId,
        duration: values.duration || undefined,
      };

      const response = await api.post('/users/addlesson', lessonData, {
        withCredentials: true,
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to add lesson');
      }

      toast.success('Lesson added successfully');
      setLessonCount((prev) => prev + 1);

      resetForm();
      setVideo(null);
      setVideoPreviewUrl(null);
      setVideoError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error submitting lesson:', err);
      setError(err.response?.data?.message || 'Failed to add lesson. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        await validateVideoFile(file);

        const url = URL.createObjectURL(file);
        setVideo(file);
        setVideoPreviewUrl(url);
        setVideoError(null);
      }
    } catch (err: any) {
      setVideoError(err.message);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideo(null);
    setVideoPreviewUrl(null);
    setVideoError(null);
    setUploadProgress(0);

    // if (fileInputRef.current) {
    //   fileInputRef.current.value = '';
    // }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFinishCourse = async () => {
    try {
      // Validate that at least one lesson has been added
      if (lessonCount === 0) {
        toast.error('Cannot publish course: At least one lesson is required');
        return;
      }

      // Call the publish course endpoint
      const response = await api.post(
        '/users/publishcourse',
        { courseId },
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to publish course');
      }

      toast.success('Course published successfully');
      navigate('/instructorcourses');
    } catch (err: any) {
      console.error('Error publishing course:', err);
      toast.error(err.response?.data?.message || 'Failed to publish course');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`flex-1 min-h-screen transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
      >
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Add New Lesson</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Lesson Content</h2>
            <p className="text-gray-600 mt-1">
              Upload your video and add information about this lesson
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Lesson Information</h3>
                  </div>

                  {/* Two-column layout */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* LEFT SIDE: Video Upload */}
                      <div className="space-y-4">
                        <h4 className="text-base font-medium text-gray-700 mb-2">Lesson Video</h4>

                        {/* Upload Zone */}
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
                            <button
                              type="button"
                              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Select Video
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Video Preview - REDUCED SIZE */}
                            <div className="relative rounded-lg overflow-hidden bg-gray-800 border border-gray-200">
                              <video
                                src={videoPreviewUrl}
                                controls
                                className="w-full h-auto max-h-[240px] object-contain"
                                onError={() => {
                                  setVideoError('Error loading video. The format may be unsupported by your browser.');
                                }}
                              />
                              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white text-sm font-medium truncate max-w-[200px]">
                                    {video?.name}
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

                            {/* Change Video Button */}
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
                          accept="video/mp4,video/quicktime"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {/* Upload Progress */}
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

                        {/* Error/Success Messages */}
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

                      {/* RIGHT SIDE: Lesson Details */}
                      <div className="space-y-4">
                        <h4 className="text-base font-medium text-gray-700 mb-2">Lesson Details</h4>

                        {/* Title */}
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

                        {/* Description */}
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

                    {/* Action Buttons - Right Bottom Corner */}
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
                        {isSubmitting ? 'Saving...' : uploading ? `Uploading (${uploadProgress}%)` : 'Add Lesson'}
                      </button>
                      <button
                        type="button"
                        onClick={handleFinishCourse}
                        className="py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                      >
                        Finish Course
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default InstructorAddLesson;