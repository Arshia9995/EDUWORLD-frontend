import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiLogOut, FiMenu, FiList, FiDollarSign, FiBell } from "react-icons/fi";
import logo from '../assets/home/logo.png';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logoutAdminAction } from "../redux/actions/adminActions";
import toast from "react-hot-toast";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdminAction()).unwrap();
      toast.success("Logged out successfully");
      navigate("/admin/login"); 
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-blue-900 text-white fixed top-0 left-0 h-full p-5 transition-all duration-300 z-50 overflow-y-auto`}
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
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/dashboard') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiHome />
          {isSidebarOpen && <span>Dashboard</span>}
        </Link>
        <Link
          to="/admin/categories"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/categories') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiList />
          {isSidebarOpen && <span>Categories</span>}
        </Link>
        <Link
          to="/admin/studentslist"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/studentslist') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiUsers />
          {isSidebarOpen && <span>Students</span>}
        </Link>
        <Link
          to="/admin/instructorslist"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/instructorslist') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiUsers />
          {isSidebarOpen && <span>Instructors</span>}
        </Link>
        <Link
          to="/admin/approvedinstructors"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/approvedinstructors') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiUsers />
          {isSidebarOpen && <span>Approved Instructors</span>}
        </Link>
        <Link
          to="/admin/announcements"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/announcements') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiBell />
          {isSidebarOpen && <span>Announcements</span>}
        </Link>
        <Link
          to="/admin/payment-history"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/payment-history') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiDollarSign />
          {isSidebarOpen && <span>Payment Details</span>}
        </Link>
        <Link
          to="/admin/adminwallet"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/adminwallet') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiDollarSign />
          {isSidebarOpen && <span>Wallet</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors w-full text-left ${
            isActive('/admin/login') ? 'bg-yellow-400 text-blue-900' : 'text-white hover:text-yellow-400'
          }`}
        >
          <FiLogOut />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;