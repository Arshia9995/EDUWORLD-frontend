import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiBookOpen, FiMenu, FiDollarSign, FiBell } from 'react-icons/fi';
import logo from '../assets/home/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const StudentSidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const goToHome = () => {
    navigate('/');
  };

  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-blue-900 text-white h-screen p-5 pt-8 fixed top-0 left-0 z-50 transition-all duration-300 overflow-y-auto`}
    >
      <div className="flex items-center space-x-2 mb-6">
        <img src={logo} alt="EduWorld Logo" className="h-10 w-10" />
        {sidebarOpen && (
          <h2 className="text-lg font-bold text-yellow-400">EduWorld</h2>
        )}
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mb-6 text-yellow-400 focus:outline-none"
      >
        <FiMenu size={24} />
      </button>

      <button
        onClick={goToHome}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-4 ${
          isActive('/') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
        }`}
      >
        <FiHome className="h-5 w-5" />
        {sidebarOpen && <span className="font-medium">Go to Home</span>}
      </button>

      <nav className="space-y-4">
        <Link
          to="/studentdashboard"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/studentdashboard') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiHome />
          {sidebarOpen && <span>Dashboard</span>}
        </Link>
        <Link
          to="/student/allcourses"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/student/allcourses') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiBookOpen />
          {sidebarOpen && <span>All Courses</span>}
        </Link>
        <Link
          to="/enrolled-courses"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/enrolled-courses') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiBook />
          {sidebarOpen && <span>My Courses</span>}
        </Link>
        <Link
          to="/announcements"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/announcements') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiBell />
          {sidebarOpen && <span>Announcements</span>}
        </Link>
        <Link
          to="/payment-history"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/payment-history') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiDollarSign />
          {sidebarOpen && <span>Payment Details</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default StudentSidebar;