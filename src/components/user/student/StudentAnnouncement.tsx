import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronLeft, FiUser, FiCalendar } from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import Pagination from '../../../common/Pagination';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdBy: { email: string };
  createdAt: string;
  isActive: boolean;
}

const StudentAnnouncements: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 announcements per page

  const fetchActiveAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/getactiveannouncements', {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch announcements');
      }

      const sortedAnnouncements = response.data.data.sort(
        (a: Announcement, b: Announcement) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAnnouncements(sortedAnnouncements);
      setCurrentPage(1); // Reset to page 1 on fetch
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch announcements';
      
      toast.error(errorMessage);
      setAnnouncements([]); // Ensure announcements is empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBackToDashboard = () => {
    navigate('/studentdashboard');
  };

  // Pagination logic
  const totalItems = announcements.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-900 transition-all duration-200"
                  aria-label="Back to Dashboard"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">
                  Announcements
                </h1>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="px-5 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Back to Dashboard
              </button>
            </div>
            <p className="text-gray-600 mt-3 text-sm sm:text-base font-medium">
              Stay updated with the latest announcements from your institution.
            </p>
          </div>

          {/* Loading State with Skeleton Loader */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 animate-pulse shadow-sm border-l-4 border-gray-200"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : announcements.length === 0 ? (
            /* Empty State (also used for error state) */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center max-w-lg mx-auto">
              <div className="bg-blue-100 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6">
                <FiBell className="h-14 w-14 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Announcements Available</h3>
              <p className="text-gray-600 text-lg">There are no active announcements at the moment.</p>
            </div>
          ) : (
            /* Announcements List with Pagination */
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
                  Active Announcements
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  {currentAnnouncements.map((announcement, index) => (
                    <div
                      key={announcement._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg border-l-4 border-blue-500 transform hover:-translate-y-1 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center mb-3">
                        <FiBell className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      <div className="flex flex-wrap text-sm text-gray-600">
                        <div className="flex items-center mr-6 mb-2">
                          <FiUser className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">{announcement.createdBy.email}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <FiCalendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">{formatDate(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAnnouncements;