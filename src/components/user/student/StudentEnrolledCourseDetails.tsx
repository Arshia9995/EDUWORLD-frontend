import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiBookOpen, FiClock, FiDollarSign, FiGlobe, 
  FiUser, FiTag, FiChevronLeft, FiPlayCircle, FiCheckCircle,
  FiMessageCircle
} from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import CourseReview from './CourseReview';
import CourseReviewsList from './CourseReviewList';
import Certificate from './Certificate';
import ChatModal from './ChatModal';

interface Lesson {
  _id: string;
  lessonNumber: number;
  title: string;
  description?: string;
  duration?: string;
  video?: string;
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

interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
  progress: {
    completedLessons: string[];
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentEnrolledCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [courseCompletionPercentage, setCourseCompletionPercentage] = useState(0);
  const [studentName, setStudentName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [markingAsCompleted, setMarkingAsCompleted] = useState<Set<string>>(new Set());
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchCourseDetails = async () => {
    if (!courseId) {
      setError('Course ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const courseResponse = await api.get(`/users/enrolled-course-detailss/${courseId}`, {
        withCredentials: true,
      });

      if (courseResponse.status !== 200) {
        throw new Error(courseResponse.data.message || 'Failed to fetch course details');
      }

      const courseData = courseResponse.data.course;

      if (courseData.lessons && courseData.lessons.length > 0) {
        const lessonsResponse = await api.get(`/users/enrolled-course-lessons/${courseId}`, {
          withCredentials: true,
        });

        if (lessonsResponse.status !== 200) {
          throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
        }

        const sortedLessons = (lessonsResponse.data.lessons || []).sort(
          (a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber
        );
        setLessons(sortedLessons);
        if (sortedLessons.length > 0) {
          setActiveLesson(sortedLessons[0]._id);
        }
      } else {
        setLessons([]);
      }

      const enrollmentResponse = await api.get(`/users/enrolled-course-detailss/${courseId}`, {
        withCredentials: true,
      });
      const enrollmentData = enrollmentResponse.data.enrollment || {
        progress: { completedLessons: [], overallCompletionPercentage: 0 },
      };
      setEnrollment(enrollmentData);
      setCourseCompletionPercentage(enrollmentData.progress.overallCompletionPercentage || 0);

      const userResponse = await api.get('/users/profile', {
        withCredentials: true,
      });
      setStudentName(userResponse.data.user.name || 'Student');
      setUserId(userResponse.data.user._id || '');

      
      const chatResponse = await api.get(`/users/getchat/${courseId}`, {
        withCredentials: true,
      });
      if (chatResponse.data.success) {
        setUnreadCount(chatResponse.data.unreadCount || 0);
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

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleBackToEnrolledCourses = () => {
    navigate('/enrolled-courses');
  };

  const handleVideoProgress = () => {
    if (videoRef.current && lessons.length > 0 && activeLesson) {
      const { currentTime, duration } = videoRef.current;
      const percentageWatched = (currentTime / duration) * 100;
  
      if (
        percentageWatched >= 80 && 
        !enrollment?.progress.completedLessons.includes(activeLesson) &&
        !markingAsCompleted.has(activeLesson)
      ) {
        setMarkingAsCompleted(prev => new Set(prev).add(activeLesson));
        updateLessonCompletion(activeLesson);
      }
    }
  };

  const updateLessonCompletion = async (lessonId: string) => {
    try {
      const response = await api.post('/users/update-lesson-progress', {
        courseId,
        lessonId,
        status: 'completed',
      }, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        const updatedEnrollment = response.data.enrollment;
        setEnrollment(updatedEnrollment);
        setCourseCompletionPercentage(updatedEnrollment.progress.overallCompletionPercentage);
        toast.success('Lesson marked as completed!');
      }
    } catch (error) {
      console.error('Failed to update lesson progress:', error);
      toast.error('Failed to mark lesson as complete');
    } finally {
      setMarkingAsCompleted(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const activeLessonData = lessons.find((lesson) => lesson._id === activeLesson);

  if (!courseId) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '5rem',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-semibold">Course ID is missing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleBackToEnrolledCourses} 
                  className="text-gray-600 hover:text-blue-900 transition-colors"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold text-blue-900">Enrolled Course Details</h1>
              </div>
              <div className="flex items-center space-x-3">
                
                {course && (
                  <div className="relative">
                    <button
                      onClick={toggleChat}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
                      title="Course Chat"
                    >
                      <FiMessageCircle className="h-5 w-5 mr-2" />
                      <span>Chat</span>
                    </button>
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={handleBackToEnrolledCourses}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                >
                  Back to Enrolled Courses
                </button>
              </div>
            </div>
            <p className="text-gray-500 mt-2">Detailed insights into your enrolled course</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading course details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          ) : !course ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center max-w-md mx-auto">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="h-12 w-12 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h3>
              <p className="text-gray-600 mb-6">The course you are looking for might have been removed or is currently unavailable.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="md:col-span-1 relative overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
                      alt={course.title}
                      className="w-full h-64 md:h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${course.thumbnail}`);
                        e.currentTarget.src = 'https://via.placeholder.com/500x300?text=No+Thumbnail';
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 p-8 bg-white">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>
                    {enrollment && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Your Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${courseCompletionPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{courseCompletionPercentage}% completed</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiDollarSign className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Price</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">
                          {course.price === 0 ? 'FREE' : `₹${course.price}`}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiBookOpen className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Lessons</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">{lessons.length}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiGlobe className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Language</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">{course.language}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiTag className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Category</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">
                          {course.category?.categoryName || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        {course.instructor?.name || 'Unknown'}
                      </span>
                    </div>
                    {courseCompletionPercentage === 100 && (
                      <div className="mt-6">
                        <Certificate 
                          courseTitle={course.title}
                          studentName={studentName}
                          completionDate={enrollment?.updatedAt || new Date()}
                          instructorName={course.instructor?.name || "Course Instructor"}
                        />
                      </div>
                    )}
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
                              <div className={`flex-shrink-0 ${
                                enrollment?.progress.completedLessons.includes(lesson._id)
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600'
                              } font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs`}>
                                {enrollment?.progress.completedLessons.includes(lesson._id) ? <FiCheckCircle /> : index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-sm ${
                                  activeLesson === lesson._id
                                    ? 'text-blue-600'
                                    : enrollment?.progress.completedLessons.includes(lesson._id)
                                    ? 'text-green-600'
                                    : 'text-gray-800'
                                }`}>
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
                            ref={videoRef}
                            key={activeLessonData.video}
                            controls
                            className="w-full h-full object-contain"
                            onError={() => handleVideoError(activeLessonData._id)}
                            onTimeUpdate={handleVideoProgress}
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
                        <h2 className="text-xl font-bold text-gray-800 mb-3">{activeLessonData.title}</h2>
                        <p className="text-gray-600">{activeLessonData.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
                      <p className="text-gray-500">
                        {lessons.length > 0
                          ? 'Select a lesson from the sidebar to view its content'
                          : 'This course doesn’t have any lessons yet'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {enrollment && (
            <div className="mt-8 flex flex-col lg:flex-row justify-between">
              <div className="w-full lg:w-[400px] mb-6 lg:mb-0">
                <CourseReview 
                  courseId={courseId} 
                  studentId={enrollment.userId}
                  onReviewSubmitted={() => setReviewSubmitted(prev => !prev)} 
                />
              </div>
              <div className="w-full lg:w-80 max-h-[400px] overflow-y-auto bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-4">
                <CourseReviewsList 
                  courseId={courseId}
                  reviewSubmitted={reviewSubmitted}
                />
              </div>
            </div>
          )}
         
          {course && (
            <ChatModal
              isOpen={isChatOpen}
              onClose={toggleChat}
              courseId={courseId}
              instructorId={course.instructor._id}
              userId={userId}
              userName={studentName}
              courseTitle={course.title}
              setUnreadCount={setUnreadCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledCourseDetails;


