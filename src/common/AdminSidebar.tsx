import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiLogOut, FiMenu,FiList } from "react-icons/fi";
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

    const handleLogout = async () => {
        try {
          await dispatch(logoutAdminAction()).unwrap();
          toast.success("Logged out successfully");
          navigate("/admin/login"); // Redirect to admin login page
        } catch (error) {
          toast.error("Failed to logout");
        }
      };


  return (
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
        to="/admin/categories" 
        className="flex items-center space-x-2 hover:text-yellow-400"
        >
          <FiList />
          {isSidebarOpen && <span>Categories</span>}
        </Link>
        <Link
          to="/admin/studentslist"
          className="flex items-center space-x-2 hover:text-yellow-400"
        >
          <FiUsers />
          {isSidebarOpen && <span>Students</span>}
        </Link>
        <Link
          to="/admin/instructorslist"
          className="flex items-center space-x-2 hover:text-yellow-400"
        >
          <FiUsers />
          {isSidebarOpen && <span>Instructors</span>}
        </Link>
        <Link
          to="/admin/approvedinstructors"
          className="flex items-center space-x-2 hover:text-yellow-400"
        >
          <FiUsers />
          {isSidebarOpen && <span>Approved Instructors</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:text-yellow-400 w-full text-left"
        >
          <FiLogOut />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;