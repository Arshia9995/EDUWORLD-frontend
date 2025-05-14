import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AdminSidebar from "../../common/AdminSidebar";
import { api } from "../../config/api";
import { Bell, Calendar, User, Check, X, RefreshCw, Pencil } from "lucide-react";
import Pagination from "../../common/Pagination";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdBy: { email: string };
  createdAt: string;
  isActive: boolean;
}

const Announcements: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(4); // Number of announcements per page
  const { loading } = useSelector((state: RootState) => state.admin);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/admin/getannouncements", {
        withCredentials: true,
      });
      const sortedAnnouncements = response.data.data.sort(
        (a: Announcement, b: Announcement) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAnnouncements(sortedAnnouncements);
      setCurrentPage(1); // Reset to page 1 on fetch
    } catch (err) {
      toast.error("Failed to fetch announcements");
      setAnnouncements([]); // Ensure announcements is empty on error
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter both title and content!");
      return;
    }

    try {
      const response = await api.post(
        "/admin/create-announcements",
        { title, content },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setTitle("");
      setContent("");
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create announcement");
    }
  };

  const handleToggleAnnouncementStatus = async (announcementId: string, isActive: boolean) => {
    try {
      const endpoint = isActive ? "/admin/announcements/deactivate" : "/admin/announcements/reactivate";
      const response = await api.put(
        endpoint,
        { announcementId },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isActive ? "deactivate" : "activate"} announcement`);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditAnnouncement(announcement);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setEditModalOpen(true);
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please enter both title and content!");
      return;
    }

    try {
      const response = await api.put(
        "/admin/announcements/update",
        {
          announcementId: editAnnouncement?._id,
          title: editTitle,
          content: editContent,
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setEditModalOpen(false);
      setEditAnnouncement(null);
      setEditTitle("");
      setEditContent("");
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update announcement");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination logic
  const totalItems = announcements.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-blue-900">Manage Global Announcements</h1>
        </div>

        {/* Create Announcement Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Announcement</h2>
          <form onSubmit={handleCreateAnnouncement} className="flex flex-col">
            <label htmlFor="title" className="text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter announcement title"
              disabled={loading}
            />
            <label htmlFor="content" className="text-gray-700 font-semibold mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={5}
              placeholder="Enter announcement content"
              disabled={loading}
            />
            <button
              type="submit"
              className={`bg-blue-900 text-white p-2 rounded-md hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Announcement"}
            </button>
          </form>
        </div>

        {/* All Announcements List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              All Announcements
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
              {announcements.length} Total
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No announcement is available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`bg-white border-l-4 ${
                      announcement.isActive ? "border-blue-500" : "border-gray-300"
                    } rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                        <div
                          className={`text-xs font-medium py-1 px-2 rounded flex items-center ${
                            announcement.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {announcement.isActive ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-600 mb-4 whitespace-pre-wrap">
                        {announcement.content}
                      </div>

                      <div className="flex flex-wrap text-xs text-gray-500 border-t pt-3 mt-2">
                        <div className="flex items-center mr-4 mb-2">
                          <User className="w-3 h-3 mr-1" />
                          {announcement.createdBy.email}
                        </div>
                        <div className="flex items-center mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(announcement.createdAt)}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="mt-2 flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                          disabled={loading}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleAnnouncementStatus(announcement._id, announcement.isActive)}
                          className={`mt-2 flex items-center text-sm font-medium ${
                            announcement.isActive
                              ? "text-red-500 hover:text-red-700"
                              : "text-green-500 hover:text-green-700"
                          }`}
                          disabled={loading}
                        >
                          {announcement.isActive ? (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </button>
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
            </>
          )}
        </div>

        {/* Edit Announcement Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Announcement</h2>
              <form onSubmit={handleUpdateAnnouncement} className="flex flex-col">
                <label htmlFor="editTitle" className="text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter announcement title"
                  disabled={loading}
                />
                <label htmlFor="editContent" className="text-gray-700 font-semibold mb-2">
                  Content
                </label>
                <textarea
                  id="editContent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  rows={5}
                  placeholder="Enter announcement content"
                  disabled={loading}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`bg-blue-900 text-white p-2 rounded-md hover:bg-blue-700 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Announcements;