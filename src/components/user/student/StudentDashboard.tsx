
import React, { useState } from 'react';
import { MessageSquare, Bell, Menu, X } from 'lucide-react';
import StudentSidebar from '../../../common/StudentSidebar';


const StudentDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem', 
          transition: 'margin-left 0.3s ease', 
        }}
      >
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Welcome to Student Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Explore your enrolled courses, track your progress, and connect with instructors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;