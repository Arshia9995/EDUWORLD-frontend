import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { getallInstructors, approveInstructor, rejectInstructor } from "../../redux/actions/adminActions";
import toast from "react-hot-toast";

const AdminInstructors: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const { instructors = [], instructorLoading, instructorError } = useSelector(
    (state: RootState) => {
      console.log("Redux State:", state); // Debug state
      return state.admin || { instructors: [], instructorLoading: false, instructorError: null };
    }
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track individual action loading

  useEffect(() => {
    dispatch(getallInstructors());
  }, [dispatch]);

  console.log("Instructors State:", instructors); // Debug instructors

  const handleApprove = async (instructorId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActionLoading(instructorId); // Set loading for this specific instructor
    try {
      await dispatch(approveInstructor(instructorId)).unwrap();
      toast.success("Instructor approved successfully!");
    } catch (error: any) {
      console.error("Approve Error:", error);
      toast.error(error || "Failed to approve instructor");
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  const handleReject = async (instructorId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActionLoading(instructorId); // Set loading for this specific instructor
    try {
      await dispatch(rejectInstructor(instructorId)).unwrap();
      toast.success("Instructor rejected successfully!");
    } catch (error: any) {
      console.error("Reject Error:", error);
      toast.error(error || "Failed to reject instructor");
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-blue-900 text-white h-screen p-5 transition-all duration-300`}
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
          <Link to="/admin/dashboard" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiHome />
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/studentslist" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiUsers />
            {isSidebarOpen && <span>Students</span>}
          </Link>
          <Link to="/admin/instructorslist" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiUsers />
            {isSidebarOpen && <span>Instructors</span>}
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiSettings />
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          <Link to="/admin/logout" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiLogOut />
            {isSidebarOpen && <span>Logout</span>}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Instructors List</h1>

        {instructorLoading && <p className="text-blue-900">Loading instructors...</p>}
        {instructorError && <p className="text-red-600">{instructorError}</p>}

        {!instructorLoading && !instructorError && (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">S.No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(instructors) && instructors.length > 0 ? (
                instructors.map((instructor, index) => (
                  <tr key={instructor._id} className="border-b text-center">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{instructor.name}</td>
                    <td className="p-3">{instructor.email}</td>
                    <td className="p-3 space-x-2">
                      {/* For Requested Instructors */}
                      {instructor.isRequested && !instructor.isApproved && !instructor.isRejected && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => handleApprove(instructor._id!, event)}
                            className={`px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600 ${
                              actionLoading === instructor._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading === instructor._id}
                          >
                            {actionLoading === instructor._id ? "Approving..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={(event) => handleReject(instructor._id!, event)}
                            className={`px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 ${
                              actionLoading === instructor._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading === instructor._id}
                          >
                            {actionLoading === instructor._id ? "Rejecting..." : "Reject"}
                          </button>
                        </>
                      )}
                      {/* For Approved Instructors */}
                      {instructor.isApproved && !instructor.isRejected && (
                        <>
                          <span className="text-green-600 mr-2">Approved</span>
                          <button
                            type="button"
                            onClick={(event) => handleReject(instructor._id!, event)}
                            className={`px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 ${
                              actionLoading === instructor._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading === instructor._id}
                          >
                            {actionLoading === instructor._id ? "Rejecting..." : "Reject"}
                          </button>
                        </>
                      )}
                      {/* For Rejected Instructors */}
                      {instructor.isRejected && !instructor.isApproved && (
                        <>
                          <span className="text-red-600 mr-2">Rejected</span>
                          <button
                            type="button"
                            onClick={(event) => handleApprove(instructor._id!, event)}
                            className={`px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600 ${
                              actionLoading === instructor._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading === instructor._id}
                          >
                            {actionLoading === instructor._id ? "Approving..." : "Approve"}
                          </button>
                        </>
                      )}
                      {/* Fallback for unexpected states (optional) */}
                      {(!instructor.isRequested && !instructor.isApproved && !instructor.isRejected) && (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-3">
                    No instructors found.
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

export default AdminInstructors;