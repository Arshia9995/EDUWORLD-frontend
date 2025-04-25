import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiBookOpen, FiClock, FiDollarSign, FiGlobe, 
  FiUser, FiList, FiChevronLeft, FiStar,  
} from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import CourseReviewsList from './CourseReviewList';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY!);

// Define the Lesson interface (excluding video)
interface Lesson {
  _id: string;
  lessonNumber: number;
  title: string;
  description?: string;
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

interface Payment {
  _id: string;
  courseId: string | { _id: string };
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

const StudentCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  const fetchCourseDetails = async () => {
    if (!courseId) {
      setError('Course ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const courseResponse = await api.get(`/users/getstudentcoursebyid/${courseId}`, {
        withCredentials: true,
      });

      if (courseResponse.status !== 200) {
        throw new Error(courseResponse.data.message || 'Failed to fetch course details');
      }

      const courseData = courseResponse.data.course;

      if (courseData.lessons && courseData.lessons.length > 0) {
        const lessonsResponse = await api.get(`/users/getstudentlessonbycourseid/${courseId}`, {
          withCredentials: true,
        });

        if (lessonsResponse.status !== 200) {
          throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
        }

        const sortedLessons = (lessonsResponse.data.lessons || []).sort(
          (a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber
        );
        setLessons(sortedLessons);
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

  const checkEnrollment = async () => {
    try {
      const response = await api.get(`/users/check-enrollment/${courseId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsEnrolled(response.data.isEnrolled);
      }
    } catch (err: any) {
      console.error('Error checking enrollment:', err);
      toast.error('Failed to check enrollment status');
    }
  };

  const checkPaymentStatus = async (): Promise<boolean> => {
    try {
      const response = await api.get('/users/payment-history', {
        withCredentials: true,
      });

      if (response.data.success) {
        const payments: Payment[] = response.data.data;
        return payments.some(
          (payment) =>
            (typeof payment.courseId === 'string' ? payment.courseId : payment.courseId._id) === courseId &&
            payment.status === 'completed'
        );
      }
      return false;
    } catch (err: any) {
      console.error('Error checking payment status:', err);
      toast.error('Failed to check payment status');
      return false;
    }
  };

  const handleEnroll = async () => {
    setPaymentLoading(true);
    setError(null);

    try {
      // Check enrollment status
      if (isEnrolled) {
        toast.error('You are already enrolled in this course.');
        return;
      }

      // Check payment status
      const hasPaid = await checkPaymentStatus();
      if (hasPaid) {
        toast.error('You have already paid for this course.');
        return;
      }

      // Proceed with enrollment for free course
      if (course?.price === 0) {
        const response = await api.post(
          '/users/enroll-free',
          { courseId },
          { withCredentials: true }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to enroll in the course');
        }

        toast.success('Enrollment successful!');
        setIsEnrolled(true);
        return;
      }

      // Proceed with Stripe payment for paid course
      const response = await api.post(
        '/users/create-checkout-session',
        { courseId },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }

      const sessionId = response.data.sessionId;

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      toast.error(err.message || 'Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleGoToCourse = () => {
    navigate('/enrolled-courses');
  };

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [courseId]);

  const handleBackToDashboard = () => {
    navigate('/studentdashboard');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleBackToDashboard} 
                  className="text-gray-600 hover:text-blue-900 transition-colors"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold text-blue-900">Course Details</h1>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
            <p className="text-gray-500 mt-2">Detailed insights into your selected course</p>
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="bg-blue-900 text-white p-6">
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <div className="flex items-center mt-2">
                  <FiUser className="h-5 w-5 mr-2" />
                  <span>Instructor: {course.instructor?.name || 'Unknown'}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                      alt={course.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        console.error(`Failed to load image: ${course.thumbnail}`);
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-900">
                          <span className="h-5 w-5 mr-0 font-bold">₹</span>
                          <span className="font-semibold">
                            {course.price === 0 ? 'FREE' : `₹${course.price}`}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-900">
                          <FiGlobe className="h-5 w-5 mr-2" />
                          <span className="font-semibold">{course.language}</span>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center text-purple-900">
                          <FiBookOpen className="h-5 w-5 mr-2" />
                          <span className="font-semibold">
                            {course.category?.categoryName || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center text-yellow-900">
                          <FiList className="h-5 w-5 mr-2" />
                          <span className="font-semibold">{lessons.length} Lessons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Course Lessons</h3>
                  {lessons && lessons.length > 0 ? (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div 
                          key={lesson._id} 
                          className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-blue-900 font-semibold mr-2">
                                Lesson {lesson.lessonNumber}:
                              </span>
                              <span className="text-gray-800">{lesson.title}</span>
                            </div>
                            {lesson.description && (
                              <p className="text-gray-600 text-sm">{lesson.description}</p>
                            )}
                          </div>
                          {lesson.duration && (
                            <div className="flex items-center text-gray-500">
                              <FiClock className="h-5 w-5 mr-2" />
                              <span className="text-sm">{lesson.duration}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      <FiBookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No lessons available for this course.</p>
                    </div>
                  )}
                </div>

                 {/* Add Course Reviews Section */}
                <div className="mt-8 flex justify-start">
                  <div className="w-full lg:w-80 max-h-[400px] overflow-y-auto bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-4">
                    <CourseReviewsList courseId={courseId!} />
                  </div>
                </div>
               

                <div className="absolute bottom-6 right-6">
                  {isEnrolled ? (
                    <button
                      onClick={handleGoToCourse}
                      className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
                    >
                      Go to Course
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={paymentLoading}
                      className={`py-3 px-6 rounded-lg font-semibold shadow-md ${
                        paymentLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-900 text-white hover:bg-blue-800'
                      } transition-colors`}
                    >
                      {paymentLoading ? 'Processing...' : course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetails;