// StudentAllCourses.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

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

const StudentAllCourses: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/getallpublishedcourses', {
          withCredentials: true,
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to fetch courses');
        }

        setCourses(response.data.courses || []);
      } catch (err: any) {
        console.error('Error fetching all courses:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  const handleViewCourse = (courseId: string) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Main Content Area */}
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-2">All Courses</h1>
              <p className="text-gray-600">Explore all available courses and start learning today</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FiBookOpen className="h-6 w-6 text-blue-900" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-blue-900">{courses.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            /* Placeholder for No Courses */
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
              <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FiBookOpen className="h-10 w-10 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Available</h3>
              <p className="text-gray-600 mb-6">There are no courses available at the moment. Check back later!</p>
            </div>
          ) : (
            /* Course List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 relative"
                >
                  {/* Thumbnail with overlay */}
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                      alt={course.title}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${course.thumbnail}`);
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                      }}
                    />
                    <div className="absolute top-0 left-0 mt-3 ml-3">
                      <span className="bg-blue-900 text-white text-xs px-2 py-1 rounded-md">
                        {course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </span>
                    </div>
                    <div className="absolute top-0 right-0 mt-3 mr-3">
                      <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-md shadow-sm">
                        {course.language}
                      </span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 relative">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {course.category?.categoryName || 'Uncategorized'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">• {course.lessons?.length || 0} Lessons</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-medium mr-2 text-white">
                          {course.instructor?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-gray-600">{course.instructor?.name || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewCourse(course._id)}
                      className="absolute bottom-5 right-5 bg-blue-900 text-white py-1 px-3 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                    >
                      View Details
                    </button>
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

export default StudentAllCourses;