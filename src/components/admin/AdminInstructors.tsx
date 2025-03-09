import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { FiUsers, FiHome, FiSettings, FiLogOut, FiMenu, FiDownload,FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { getallInstructors, approveInstructor, rejectInstructor } from "../../redux/actions/adminActions";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../config/constants";

const AdminInstructors: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { instructors = [], instructorLoading, instructorError } = useSelector(
    (state: RootState) => {
      console.log("Redux State:", state); // Debug state
      return state.admin || { instructors: [], instructorLoading: false, instructorError: null };
    }
  );
  

  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track individual action loading
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null); // Track download loading

  // Filter instructors based on search query
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    dispatch(getallInstructors());
  }, [dispatch]);

  console.log("Instructors State:", instructors); // Debug instructors
  console.log("Filtered Instructors:", filteredInstructors); // Debug filtered instructors

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


  const handleDownloadCV = async (cvUrl: string, instructorName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (!cvUrl) {
      toast.error("No CV available for this instructor");
      return;
    }
    
    // Extract filename from S3 URL
    const fileName = cvUrl.split('/').pop();
    if (!fileName) {
      toast.error("Invalid CV file path");
      return;
    }
    
    setDownloadLoading(cvUrl); // Set loading state using cvUrl as key
    
    try {
      // Get a pre-signed URL for the CV file
      const { data } = await axios.post(`${baseUrl}/users/get-s3-url`, {
        fileName: fileName,
        fileType: "application/pdf",
        getUrl: true
      });
      
      if (!data.downloadUrl) {
        throw new Error("Failed to get download URL");
      }
      
      // Create a safe filename for download (instructor's name + original extension)
      const extension = fileName.split('.').pop() || 'pdf';
      const safeFileName = `${instructorName.replace(/[^a-z0-9]/gi, '_')}_CV.${extension}`;
      
      // Create a temporary anchor tag to trigger the download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.setAttribute('download', safeFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CV download started");
    } catch (error: any) {
      console.error("Download Error:", error);
      toast.error(error.message || "Failed to download CV");
    } finally {
      setDownloadLoading(null);
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
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Instructors List</h1>
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

        {instructorLoading && <p className="text-blue-900">Loading instructors...</p>}
        {instructorError && <p className="text-red-600">{instructorError}</p>}

        {!instructorLoading && !instructorError && (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">S.No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">CV</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredInstructors) && filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor, index) => (
                  <tr key={instructor._id} className="border-b text-center">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{instructor.name}</td>
                    <td className="p-3">{instructor.email}</td>
                    <td className="p-3">
                      {instructor.cv ? (
                        <button
                          onClick={(e) => handleDownloadCV(instructor.cv!, instructor.name!, e)}
                          className={`flex items-center justify-center mx-auto px-3 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${
                            downloadLoading === instructor.cv ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={downloadLoading === instructor.cv}
                        >
                          {downloadLoading === instructor.cv ? (
                            "Downloading..."
                          ) : (
                            <>
                              <FiDownload className="mr-1" /> Download CV
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-500">No CV</span>
                      )}
                    </td>
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
                  {searchQuery ? "No instructors match your search." : "No instructors found."}                  </td>
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