import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
// import { Link } from "react-router-dom";
// import { FiHome, FiUsers, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
// import logo from '../../assets/home/logo.png';


const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
     

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
