import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import logo from '../../assets/home/logo.png';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-blue-900 text-white h-screen p-5 transition-all duration-300`}

 >
 <div className="flex items-center space-x-2 mb-6">
          <img src={logo} alt="EduWorld Logo" className="h-10 w-10" />
          {isSidebarOpen && (
            <h2 className="text-lg font-bold text-yellow-400">EduWorld</h2>
          )}
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-6 text-yellow-400 focus:outline-none"
        >
          <FiMenu size={24} />
        </button>

        <nav className="space-y-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiHome />
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/admin/studentslist"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiUsers />
            {isSidebarOpen && <span>Students</span>}
          </Link>
           <Link to="/admin/instructorslist" className="flex items-center space-x-2 hover:text-yellow-400">
                      <FiUsers />
                      {isSidebarOpen && <span>Instructors</span>}
                    </Link>
          <Link
            to="/admin/settings"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiSettings />
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          <Link
            to="/admin/logout"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiLogOut />
            {isSidebarOpen && <span>Logout</span>}
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-extrabold text-blue-900">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-700 mt-2">
          This is the main dashboard content area.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;
