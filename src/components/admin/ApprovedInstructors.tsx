import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { getallInstructors, blockUnblockInstructor } from "../../redux/actions/adminActions";
import { toast } from "react-toastify";

const ApprovedInstructors: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [blockingIds, setBlockingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { instructors = [], instructorLoading, instructorError } = useSelector(
    (state: RootState) => {
      return state.admin || { instructors: [], instructorLoading: false, instructorError: null };
    }
  );

  // Filter to only show approved instructors
  const approvedInstructors = instructors
  .filter( (instructor) => instructor.isApproved && !instructor.isRejected)
  .filter((instructor) =>
        instructor.name!.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.email!.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  


  useEffect(() => {
    dispatch(getallInstructors());
  }, [dispatch]);

  const handleBlockToggle = async (instructorId: string, isBlocked: boolean) => {
    const actionText = isBlocked ? "unblock" : "block";
    if (window.confirm(`Are you sure you want to ${actionText} this instructor?`)) {
      setBlockingIds((prev) => [...prev, instructorId]); // Set loading state
      try {
        await dispatch(blockUnblockInstructor({ instructorId, isBlocked })).unwrap();
        toast.success(`Instructor ${actionText}ed successfully`);
      } catch (error) {
        toast.error("Failed to update instructor status");
      }
      setBlockingIds((prev) => prev.filter((id) => id !== instructorId)); // Clear loading state
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
          <Link to="/admin/approvedinstructors" className="flex items-center space-x-2 text-yellow-400">
            <FiUsers />
            {isSidebarOpen && <span>Approved Instructors</span>}
          </Link>
          {/* <Link to="/admin/settings" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiSettings />
            {isSidebarOpen && <span>Settings</span>}
          </Link> */}
          <Link to="/admin/logout" className="flex items-center space-x-2 hover:text-yellow-400">
            <FiLogOut />
            {isSidebarOpen && <span>Logout</span>}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Approved Instructors</h1>
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

        {instructorLoading && !blockingIds.length && (
          <p className="text-blue-900">Loading instructors...</p>
        )}
        {instructorError && <p className="text-red-600">{instructorError}</p>}

        {!instructorLoading && !instructorError && (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">S.No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(approvedInstructors) && approvedInstructors.length > 0 ? (
                approvedInstructors.map((instructor, index) => (
                  <tr key={instructor._id} className="border-b text-center">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{instructor.name}</td>
                    <td className="p-3">{instructor.email}</td>
                    <td className="p-3">
                      {instructor.isBlocked ? (
                        <span className="text-red-600">Blocked</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                    <td className="p-3">
                    <button
                        onClick={() =>  handleBlockToggle(instructor._id!, instructor.isBlocked!)}
                        disabled={blockingIds.includes(instructor._id!)}
                        className={`flex items-center justify-center mx-auto px-3 py-1 rounded-md text-white ${
                          instructor.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        } ${blockingIds.includes(instructor._id!) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {blockingIds.includes(instructor._id!)
                          ? "Processing..."
                          : instructor.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-3">
                  {searchQuery
                      ? "No instructors match your search."
                      : "No approved instructors found."}
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

export default ApprovedInstructors;