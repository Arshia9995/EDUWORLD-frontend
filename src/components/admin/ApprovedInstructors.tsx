import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getallInstructors, blockUnblockInstructor } from "../../redux/actions/adminActions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminSidebar from "../../common/AdminSidebar";

const ApprovedInstructors: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [blockingIds, setBlockingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; 

  const dispatch = useDispatch<AppDispatch>();

  const { instructors = [], instructorLoading, instructorError } = useSelector(
    (state: RootState) => {
      return state.admin || { instructors: [], instructorLoading: false, instructorError: null };
    }
  );

 
  const sortInstructors = (instructors: any[]) => {
    return [...instructors].sort((a, b) => {
      if (sortField === "status") {
       
        if (a.isBlocked === b.isBlocked) return 0;
        if (sortDirection === "asc") {
          return a.isBlocked ? 1 : -1; 
        } else {
          return a.isBlocked ? -1 : 1; 
        }
      } else {
       
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

  
  const filteredAndSortedInstructors = sortInstructors(
    instructors
      .filter((instructor) => instructor.isApproved && !instructor.isRejected)
      .filter((instructor) =>
        instructor.name!.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.email!.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  
  
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentInstructors = filteredAndSortedInstructors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedInstructors.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getallInstructors());
  }, [dispatch]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  const handleBlockToggle = async (instructorId: string, isBlocked: boolean) => {
    const actionText = isBlocked ? "unblock" : "block";
   
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this instructor?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      setBlockingIds((prev) => [...prev, instructorId]);
      try {
        await dispatch(blockUnblockInstructor({ instructorId, isBlocked })).unwrap();
        toast.success(`Instructor ${actionText}ed successfully`);
      } catch (error) {
        toast.error("Failed to update instructor status");
      }
      setBlockingIds((prev) => prev.filter((id) => id !== instructorId)); 
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  
  const handleSort = (field: string) => {
    if (sortField === field) {
      
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
     
      setSortField(field);
      setSortDirection("asc");
    }
  };

  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        }`} 
      >
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
          <>
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3">S.No</th>
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
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentInstructors) && currentInstructors.length > 0 ? (
                  currentInstructors.map((instructor, index) => (
                    <tr key={instructor._id} className="border-b text-center">
                      <td className="p-3">{indexOfFirstItem + index + 1}</td>
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
                          onClick={() => handleBlockToggle(instructor._id!, instructor.isBlocked!)}
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
           
            {filteredAndSortedInstructors.length > ITEMS_PER_PAGE && (
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

export default ApprovedInstructors;