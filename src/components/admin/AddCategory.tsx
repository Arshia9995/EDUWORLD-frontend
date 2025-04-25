import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../redux/actions/adminActions";
import AdminSidebar from "../../common/AdminSidebar";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../redux/store"; // Adjust path

const AddCategory: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.admin);

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter a category name!");
      return;
    }

    dispatch(addCategory(categoryName))
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        setCategoryName("");
        navigate("/admin/categories");
      })
      .catch((err) => {
        toast.error(err || "Failed to add category");
      });
  };

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
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Add Category</h1>
        <form onSubmit={handleSaveCategory} className="flex flex-col max-w-sm">
          <label htmlFor="category" className="text-gray-700 font-semibold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
            disabled={loading}
          />
          <button
            type="submit"
            className={`mt-4 bg-blue-900 text-white p-2 rounded-md hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </div>
  );
};

export default AddCategory;