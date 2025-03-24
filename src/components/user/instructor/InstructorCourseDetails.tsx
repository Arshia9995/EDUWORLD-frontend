import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock, FiPlayCircle, FiDollarSign, FiGlobe, FiTag, FiUser } from 'react-icons/fi';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface Lesson {
  _id: string;
  lessonNumber: number;
  title: string;
  description: string;
  video: string;
  duration?: string;
  course: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: { _id: string; categoryName: string; isActive: boolean };
  price: number;
  language: string;
  duration?: string;
  lessons: string[]; // Array of lesson IDs
  rating?: number;
  isPublished: boolean;
  instructor: { _id: string; name: string };
  isBlocked: boolean;
}

const InstructorCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingThumbnail, setIsRefreshingThumbnail] = useState<boolean>(false);
  const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const fetchCourseDetails = async () => {
    if (!courseId) {
      setError('Course ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch course details
      const courseResponse = await api.get(`/users/getcoursebyid/${courseId}`, {
        withCredentials: true,
      });

      if (courseResponse.status !== 200) {
        throw new Error(courseResponse.data.message || 'Failed to fetch course details');
      }

      const courseData = courseResponse.data.course;

      // Fetch lessons
      if (courseData.lessons && courseData.lessons.length > 0) {
        const lessonsResponse = await api.get(`/users/getlessonbycourseid/${courseId}`, {
          withCredentials: true,
        });

        if (lessonsResponse.status !== 200) {
          throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
        }

        const sortedLessons = (lessonsResponse.data.lessons || []).sort((a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber);
        setLessons(sortedLessons);
        
        // Set the first lesson as active by default
        if (sortedLessons.length > 0) {
          setActiveLesson(sortedLessons[0]._id);
        }
      } else {
        setLessons([]);
      }

      setCourse(courseData);
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleThumbnailError = async () => {
    if (!isRefreshingThumbnail && course && course.thumbnail) {
      setIsRefreshingThumbnail(true);
      try {
        const fileName = course.thumbnail.split('/').pop();
        if (!fileName) {
          console.error('Could not extract filename from thumbnail URL:', course.thumbnail);
          return;
        }

        const { data } = await api.post('/users/get-s3-url', {
          fileName: fileName,
          fileType: 'image/*',
          getUrl: true,
        });

        setCourse((prev) => (prev ? { ...prev, thumbnail: data.downloadUrl } : prev));
      } catch (error) {
        console.error('Error refreshing thumbnail URL:', error);
        toast.error('Failed to refresh thumbnail');
      } finally {
        setIsRefreshingThumbnail(false);
      }
    }
  };

  const handleVideoError = async (lessonId: string) => {
    if (!refreshingVideos.has(lessonId)) {
      setRefreshingVideos((prev) => new Set(prev).add(lessonId));
      try {
        const lesson = lessons.find((l) => l._id === lessonId);
        if (!lesson || !lesson.video) return;

        const fileName = lesson.video.split('/').pop();
        if (!fileName) {
          console.error('Could not extract filename from video URL:', lesson.video);
          return;
        }

        const { data } = await api.post('/users/get-s3-url', {
          fileName: fileName,
          fileType: 'video/*',
          getUrl: true,
        });

        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, video: data.downloadUrl } : l
          )
        );
      } catch (error) {
        console.error('Error refreshing video URL:', error);
        toast.error('Failed to refresh video');
      } finally {
        setRefreshingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }
    }
  };

  const handleBack = () => {
    navigate('/instructorcourses');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="flex-1 min-w-0 flex items-center justify-center"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '5rem',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="flex-1 min-w-0 p-6 lg:p-8"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '5rem',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 font-medium">{error || 'Course not found'}</p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span>Back to Course List</span>
          </button>
        </div>
      </div>
    );
  }

  const activeLessonData = lessons.find(lesson => lesson._id === activeLesson);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Course List</span>
            </button>
          </div>
          
          {/* Course Header Card */}
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Thumbnail - Reduced Size */}
              <div className="md:col-span-1">
                <div className="relative h-48 md:h-full overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load image: ${course.thumbnail}`);
                      e.currentTarget.src = 'https://via.placeholder.com/500x300?text=No+Thumbnail';
                      handleThumbnailError();
                    }}
                  />
                  {course.isPublished ? (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Published
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Draft
                    </span>
                  )}
                  {course.price === 0 && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      FREE
                    </span>
                  )}
                </div>
              </div>
              
              {/* Course Info */}
              <div className="md:col-span-2 p-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">{course.title}</h1>
                <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiDollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Price</p>
                      <p className="text-gray-800 font-bold">{course.price === 0 ? 'FREE' : `$${course.price}`}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiBookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Lessons</p>
                      <p className="text-gray-800 font-bold">{lessons.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiGlobe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Language</p>
                      <p className="text-gray-800 font-bold">{course.language}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiClock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-gray-800 font-bold">{course.duration || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiTag className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Category</p>
                      <p className="text-blue-600 font-semibold">{course.category?.categoryName || 'Uncategorized'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-blue-50 rounded-full p-2 mr-3">
                      <FiUser className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Instructor</p>
                      <p className="text-gray-800 font-semibold">{course.instructor?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lessons Navigation */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <FiBookOpen className="mr-2 text-blue-600" />
                    Course Content
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons</p>
                </div>
                
                {lessons.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No lessons available for this course.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson._id)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                          activeLesson === lesson._id ? 'bg-blue-50 border-l-4 border-blue-600 pl-2' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-100 text-blue-600 font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm ${activeLesson === lesson._id ? 'text-blue-600' : 'text-gray-800'}`}>
                              {lesson.title}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1 truncate">{lesson.description}</p>
                            {lesson.duration && (
                              <div className="flex items-center text-gray-400 text-xs mt-1">
                                <FiClock className="h-3 w-3 mr-1" />
                                <span>{lesson.duration}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Player and Lesson Details */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeLessonData ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                    {activeLessonData.video ? (
                      <video
                        controls
                        className="w-full h-full object-contain"
                        onError={() => handleVideoError(activeLessonData._id)}
                      >
                        <source src={activeLessonData.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8">
                          <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300 text-lg font-medium">No video available for this lesson</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
                        Lesson {activeLessonData.lessonNumber}
                      </span>
                      {activeLessonData.duration && (
                        <div className="flex items-center text-gray-500 text-xs">
                          <FiClock className="h-3 w-3 mr-1" />
                          <span>{activeLessonData.duration}</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {activeLessonData.title}
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600">{activeLessonData.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
                  <p className="text-gray-500">
                    {lessons.length > 0 
                      ? "Select a lesson from the sidebar to view its content" 
                      : "This course doesn't have any lessons yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetails;