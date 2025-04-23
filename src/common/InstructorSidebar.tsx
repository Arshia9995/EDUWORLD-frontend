import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiMessageSquare, FiCalendar, FiTrendingUp, FiSettings, FiHelpCircle, FiLogOut, FiMenu, FiDollarSign } from 'react-icons/fi';
import logo from '../assets/home/logo.png';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store'; // Replace with your actual logout action
import toast from 'react-hot-toast';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const InstructorSidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

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
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:text-yellow-400 transition-colors mb-4"
      >
        <FiHome className="h-5 w-5" />
        {sidebarOpen && <span className="font-medium">Go to Home</span>}
      </button>

      <nav className="space-y-4">
        <Link to="/instructordashboard" className="flex items-center space-x-2 hover:text-yellow-400">
          <FiHome />
          {sidebarOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/instructorcourses" className="flex items-center space-x-2 hover:text-yellow-400">
          <FiBook />
          {sidebarOpen && <span>My Courses</span>}
        </Link>
        <Link to="/students" className="flex items-center space-x-2 hover:text-yellow-400">
          <FiUsers />
          {sidebarOpen && <span>Students</span>}
        </Link>
        <Link to="/instructor/wallet" className="flex items-center space-x-2 hover:text-yellow-400">
          <FiDollarSign />
          {sidebarOpen && <span>Wallet</span>}
        </Link>
        <Link to="/messages" className="flex items-center space-x-2 hover:text-yellow-400">
          <FiMessageSquare />
          {sidebarOpen && <span>Messages</span>}
        </Link>
        {/* <button
          className="flex items-center space-x-2 hover:text-yellow-400 w-full text-left"
        >
          <FiLogOut />
          {sidebarOpen && <span>Logout</span>}
        </button> */}
      </nav>
    </aside>
  );
};

export default InstructorSidebar;