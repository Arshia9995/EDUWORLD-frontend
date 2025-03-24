import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const InstructorCourses: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate('/add-course'); // Navigate to the AddCourse page
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-6">My Courses</h1>
      {/* Placeholder for course list */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
        <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
        <button
          onClick={handleCreateCourse}
          className="flex items-center justify-center space-x-2 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors mx-auto"
        >
          <FiPlus />
          <span>Create Course</span>
        </button>
      </div>
    </div>
  );
};

export default InstructorCourses;