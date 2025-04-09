

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiBookOpen, FiClock, FiPlayCircle, 
  FiGlobe, FiTag, FiUser, FiCheckCircle 
} from 'react-icons/fi';
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
  lessons: string[]; 
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

      const courseResponse = await api.get(`/users/getcoursebyid/${courseId}`, {
        withCredentials: true,
      });

      if (courseResponse.status !== 200) {
        throw new Error(courseResponse.data.message || 'Failed to fetch course details');
      }

      const courseData = courseResponse.data.course;

      if (courseData.lessons && courseData.lessons.length > 0) {
        const lessonsResponse = await api.get(`/users/getlessonbycourseid/${courseId}`, {
          withCredentials: true,
        });

        if (lessonsResponse.status !== 200) {
          throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
        }

        const sortedLessons = (lessonsResponse.data.lessons || []).sort((a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber);
        setLessons(sortedLessons);
        
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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="flex-1 min-w-0 flex items-center justify-center"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '5rem',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="text-center py-12 bg-white rounded-xl shadow-md p-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
            <p className="text-gray-600 font-medium text-lg tracking-wide">
              Loading course details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '5rem',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-red-100 p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Course Not Found
              </h2>
              <p className="text-gray-600 mb-6">{error || 'The requested course could not be retrieved.'}</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FiArrowLeft />
                <span>Back to Course List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeLessonData = lessons.find(lesson => lesson._id === activeLesson);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="group flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:-translate-x-2 font-semibold"
            >
              <FiArrowLeft className="h-5 w-5 transition-transform" />
              <span className="tracking-wide">Back to Course List</span>
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:col-span-1 relative overflow-hidden">
                <div className="relative h-64 md:h-full group">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
                    alt={course.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {course.isPublished ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                        <FiCheckCircle className="mr-1" />
                        Published
                      </span>
                    ) : (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Draft
                      </span>
                    )}
                    {course.price === 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        FREE
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 p-8 bg-white">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                  {course.title}
                </h1>
                <p className="text-gray-600 leading-relaxed mb-6 text-base opacity-90">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Price', value: course.price === 0 ? 'FREE' : `₹${course.price}` },
                    { icon: FiBookOpen, label: 'Lessons', value: lessons.length },
                    { icon: FiGlobe, label: 'Language', value: course.language },
                    { icon: FiTag, label: 'Category', value: course.category?.categoryName || 'Uncategorized' }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center mb-1">
                        {Icon && <Icon className="h-5 w-5 text-blue-600 mr-2" />}
                        <span className="text-xs text-gray-500 font-medium">{label}</span>
                      </div>
                      <p className="text-gray-800 font-bold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-700 font-semibold">
                      {course.instructor?.name || 'Unknown Instructor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeLessonData ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                    {activeLessonData.video ? (
                      <video
                      key={activeLessonData.video}
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