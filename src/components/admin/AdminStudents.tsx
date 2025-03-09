import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getallStudents } from "../../redux/actions/adminActions";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu,FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { baseUrl } from "../../config/constants";
import { config } from "../../config/configuration";
import axios from "axios";
import toast from "react-hot-toast";

const AdminStudents: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { students = [], studentLoading, studentError } = useSelector(
    (state: RootState) => state.admin || { students: [], studentLoading: false, studentError: null }
  );
  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name!.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email!.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(getallStudents());
  }, [dispatch]);

  const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
    try {
      const response = await axios.post(
        `${baseUrl}${isBlocked ? "/admin/unblockstudent" : "/admin/blockstudent"}`,
        { userId },
        config
      );
      await dispatch(getallStudents());
      toast.success(response.data.message);

      // if (response.data.success) {
      //   await dispatch(getallStudents());
      //   toast.success(response.data.message);
      // } else {
      //   toast.error(response.data.message);
      // }
    } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update user status";
    toast.error(errorMessage);
    }
  };

  const handleBlockClick = (userId: string, isBlocked: boolean) => {
    toggleBlockStatus(userId, isBlocked);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  console.log("Loading:", studentLoading);
  console.log("Error:", studentError);
  console.log("Students:", students);
  console.log("Filtered Students:", filteredStudents);

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
              <Link
                      to="/admin/instructorslist"
                      className="flex items-center space-x-2 hover:text-yellow-400"
                    >
                      <FiUsers />
                      {isSidebarOpen && <span>Instructors</span>}
                    </Link>
                  <Link to="/admin/approvedinstructors" className="flex items-center space-x-2 text-yellow-400">
                            <FiUsers />
                            {isSidebarOpen && <span>Approved Instructors</span>}
                          </Link>
          {/* <Link
            to="/admin/settings"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiSettings />
            {isSidebarOpen && <span>Settings</span>}
          </Link> */}
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Students List</h1>
        <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {studentLoading && <p className="text-blue-900">Loading students...</p>}
        {studentError && <p className="text-red-600">{studentError}</p>}

        {!studentLoading && !studentError && (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="border-b text-center">
                    <td className="p-3">{student._id}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      {student.isBlocked ? "Blocked" : "Active"}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleBlockClick(student._id as string, student.isBlocked as boolean)}
                        className={`px-3 py-1 rounded-md text-white ${
                          student.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {student.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-3">
                  {searchQuery
                      ? "No students match your search."
                      : "No students found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default AdminStudents;
