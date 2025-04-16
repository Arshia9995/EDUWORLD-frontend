import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

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

interface EnrolledCourse extends Course {
  enrollment: Enrollment;
}

const StudentProgressOverview: React.FC = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/enrolled-course-detailss', {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch progress details');
      }

      const data = response.data.courses || [];
      setEnrolledCourses(data.map((course: any) => ({
        ...course,
        enrollment: course.enrollment || {
          progress: { completedLessons: [], overallCompletionPercentage: 0 },
        },
      })));
    } catch (err: any) {
      console.error('Error fetching progress:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch progress details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleBack = () => {
    navigate('/enrolled-courses');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FiChevronLeft className="h-6 w-6" />
              <span className="font-semibold">Back to Enrolled Courses</span>
            </button>
            <h1 className="text-3xl font-bold text-blue-900 mt-4">Student Progress Overview</h1>
            <p className="text-gray-500 mt-2">Track your progress across all enrolled courses</p>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center max-w-md mx-auto">
              <FiBookOpen className="h-12 w-12 text-blue-900 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Enrolled Courses</h3>
              <p className="text-gray-600">You haven’t enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {course.enrollment.completionStatus}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.enrollment.progress.overallCompletionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {course.enrollment.progress.overallCompletionPercentage}% completed
                      </p>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <FiCheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span>
                        {course.enrollment.progress.completedLessons.length} of {course.lessons.length} lessons
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressOverview;