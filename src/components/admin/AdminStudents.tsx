import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getallStudents,logoutAdminAction } from "../../redux/actions/adminActions";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { baseUrl } from "../../config/constants";
import { config } from "../../config/configuration";
import axios from "axios";
import toast from "react-hot-toast";

const AdminStudents: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Sorting states
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Fixed at 10 items per page

  const dispatch = useDispatch<AppDispatch>();

  const { students = [], studentLoading, studentError } = useSelector(
    (state: RootState) => state.admin || { students: [], studentLoading: false, studentError: null }
  );

  // Sorting function
  const sortStudents = (students: any[]) => {
    return [...students].sort((a, b) => {
      if (sortField === "status") {
        // For status field, sort by isBlocked property
        if (a.isBlocked === b.isBlocked) return 0;
        if (sortDirection === "asc") {
          return a.isBlocked ? 1 : -1; // Active (false) comes first in ascending
        } else {
          return a.isBlocked ? -1 : 1; // Blocked (true) comes first in descending
        }
      } else {
        // For name and email fields
        const fieldA = a[sortField]?.toLowerCase() || "";
        const fieldB = b[sortField]?.toLowerCase() || "";
        
        if (fieldA === fieldB) return 0;
        if (sortDirection === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA > fieldB ? -1 : 1;
        }
      }
    });
  };
  
  // Filter students based on search query and sort
  const filteredAndSortedStudents = sortStudents(
    students.filter(
      (student) =>
        student.name!.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email!.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentStudents = filteredAndSortedStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedStudents.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getallStudents());
  }, [dispatch]);

  // Reset to first page when search query or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
    try {
      const response = await axios.post(
        `${baseUrl}${isBlocked ? "/admin/unblockstudent" : "/admin/blockstudent"}`,
        { userId },
        config
      );
      await dispatch(getallStudents());
      toast.success(response.data.message);
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

  // Sorting handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  

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
          <Link 
            to="/admin/approvedinstructors" 
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiUsers />
            {isSidebarOpen && <span>Approved Instructors</span>}
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
          <>
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3">ID</th>
                  <th 
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-center">
                      Name
                      {sortField === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center justify-center">
                      Email
                      {sortField === "email" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center">
                      Status
                      {sortField === "status" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={student._id} className="border-b text-center">
                      <td className="p-3">{indexOfFirstItem + index + 1}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">
                        {student.isBlocked ? (
                          <span className="text-red-600">Blocked</span>
                        ) : (
                          <span className="text-green-600">Active</span>
                        )}
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
            {/* Pagination controls */}
            {filteredAndSortedStudents.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <FiChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number ? "bg-blue-600 text-white" : "hover:bg-blue-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages || totalPages === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminStudents;