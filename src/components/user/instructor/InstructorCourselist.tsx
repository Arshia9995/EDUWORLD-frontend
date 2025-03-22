import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMessageSquare, FiBell, FiPlus } from 'react-icons/fi';
import InstructorSidebar from '../../../common/InstructorSidebar';

const InstructorCourselist: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate('/instructoraddcourse'); // Navigate to the AddCourse page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem', // w-64 = 16rem, w-20 = 5rem
          transition: 'margin-left 0.3s ease', // Smooth transition for margin change
        }}
      >
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <FiMessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <FiBell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 lg:p-8">
          {/* Header with Create Course Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-900">My Courses</h1>
            <button
              onClick={handleCreateCourse}
              className="flex items-center space-x-2 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <FiPlus />
              <span>Create Course</span>
            </button>
          </div>

          {/* Placeholder for Course List */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourselist;