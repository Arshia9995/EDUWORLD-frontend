import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../common/AdminSidebar";
import toast from "react-hot-toast";
import { api } from "../../config/api";
import Swal from "sweetalert2";
import Pagination from "../../common/Pagination"; // Make sure the path is correct

interface CategoryDoc {
  _id: string;
  categoryName: string;
  isActive: boolean;
}

const AdminCategories: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // You can adjust this value

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/getallcategories");
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleEdit = (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const category = categories[actualIndex];
    navigate("/admin/editcategory", { state: { category } });
  };

  const handleBlockCategory = async (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const category = categories[actualIndex];
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to block the category "${category.categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, block it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const categoryId = category._id;
        const response = await api.put(`/admin/blockcategory/${categoryId}`);
        const updatedCategories = [...categories];
        updatedCategories[actualIndex].isActive = false;
        setCategories(updatedCategories);
        toast.success(response.data.message || "Category blocked successfully!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to block category");
      }
    }
  };

  const handleUnblockCategory = async (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const category = categories[actualIndex];
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to unblock the category "${category.categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const categoryId = category._id;
        const response = await api.put(`/admin/unblockcategory/${categoryId}`);
        const updatedCategories = [...categories];
        updatedCategories[actualIndex].isActive = true;
        setCategories(updatedCategories);
        toast.success(response.data.message || "Category unblocked successfully!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to unblock category");
      }
    }
  };

  const handleAddCategoryClick = () => {
    navigate("/admin/addcategory");
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get current categories for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`} // Added dynamic margin-left to prevent overlap with fixed sidebar
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-900">Categories List</h1>
          <button
            onClick={handleAddCategoryClick}
            className="bg-blue-900 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-3">S.No</th>
              <th className="p-3">Category Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length > 0 ? (
              currentCategories.map((cat, index) => (
                <tr key={cat._id} className="border-b text-center">
                  <td className="p-3">{indexOfFirstItem + index + 1}</td>
                  <td className="p-3">{cat.categoryName}</td>
                  <td className="p-3">
                    {cat.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1 rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    {cat.isActive ? (
                      <button
                        onClick={() => handleBlockCategory(index)}
                        className="px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblockCategory(index)}
                        className="px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-3">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalItems={categories.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default AdminCategories;