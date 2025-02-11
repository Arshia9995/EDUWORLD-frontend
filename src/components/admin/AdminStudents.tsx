import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getallStudents } from "../../redux/actions/adminActions";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";

const AdminStudents: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

 
  const { students, studentLoading, studentError } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getallStudents());
  }, [dispatch]);


  console.log('Loading:', studentLoading);
  console.log('Error:', studentError);
  console.log('Students:', students);

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
            to="/admin/students"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FiUsers />
            {isSidebarOpen && <span>Students</span>}
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
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Students List</h1>

        {studentLoading && <p className="text-blue-900">Loading students...</p>}
        {studentError && <p className="text-red-600">{studentError}</p>}


        {!studentLoading && !studentError && (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id } className="border-b text-center">
                    <td className="p-3">{student._id  }</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-3">
                    No students found.
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

