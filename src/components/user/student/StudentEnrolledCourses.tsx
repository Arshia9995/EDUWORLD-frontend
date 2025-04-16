// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiBookOpen, FiChevronLeft, FiUser } from 'react-icons/fi';
// import StudentSidebar from '../../../common/StudentSidebar';
// import { api } from '../../../config/api';
// import toast from 'react-hot-toast';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail?: string;
//   category: { _id: string; categoryName: string; isActive: boolean };
//   price: number;
//   language: string;
//   instructor: { _id: string; name: string };
//   enrolledAt: Date;
//   completionStatus: 'enrolled' | 'in-progress' | 'completed';
// }

// const StudentEnrolledCourses: React.FC = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEnrolledCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/users/enrolled-courses', { withCredentials: true });
//       if (response.status !== 200) {
//         throw new Error(response.data.message || 'Failed to fetch enrolled courses');
//       }

//       setCourses(response.data.courses || []);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Failed to fetch enrolled courses';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEnrolledCourses();
//   }, []);

//   const handleBackToDashboard = () => {
//     navigate('/studentdashboard');
//   };

//   const handleGoToCourse = (courseId: string) => {
//     navigate(`/course/${courseId}/learn`);
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
//       <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//       <div
//         className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
//         style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
//       >
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={handleBackToDashboard}
//                   className="text-gray-600 hover:text-blue-900 transition-colors"
//                 >
//                   <FiChevronLeft className="h-6 w-6" />
//                 </button>
//                 <h1 className="text-3xl font-bold text-blue-900">My Enrolled Courses</h1>
//               </div>
//               <button
//                 onClick={handleBackToDashboard}
//                 className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//             <p className="text-gray-500 mt-2">View all the courses you are currently enrolled in</p>
//           </div>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center min-h-[500px]">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
//               <p className="text-gray-600 text-lg">Loading enrolled courses...</p>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <p className="text-red-800 font-semibold">{error}</p>
//               </div>
//             </div>
//           ) : courses.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center max-w-md mx-auto">
//               <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//                 <FiBookOpen className="h-12 w-12 text-blue-900" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4">No Enrolled Courses</h3>
//               <p className="text-gray-600 mb-6">You haven’t enrolled in any courses yet. Explore our courses to get started!</p>
//               <button
//                 onClick={() => navigate('/studentdashboard')}
//                 className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
//               >
//                 Explore Courses
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {courses.map((course) => (
//                 <div
//                   key={course._id}
//                   className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
//                 >
//                   <img
//                     src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
//                     alt={course.title}
//                     className="w-full h-40 object-cover"
//                     onError={(e) => {
//                       console.error(`Failed to load image: ${course.thumbnail}`);
//                       e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
//                     }}
//                   />
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
//                     <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
//                     <div className="flex items-center text-gray-500 text-sm mb-2">
//                       <FiUser className="h-4 w-4 mr-1" />
//                       <span>{course.instructor?.name || 'Unknown'}</span>
//                     </div>
//                     <div className="flex items-center text-gray-500 text-sm mb-2">
//                       <span>Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center text-gray-500 text-sm mb-4">
//                       <span>Status: {course.completionStatus}</span>
//                     </div>
//                     <button
//                       onClick={() => handleGoToCourse(course._id)}
//                       className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
//                     >
//                       Go to Course
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentEnrolledCourses;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiFilter, FiSearch, FiChevronLeft } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import Pagination from '../../../common/Pagination';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: { _id: string; categoryName: string; isActive: boolean };
  price: number;
  language: string;
  instructor: { _id: string; name: string };
  enrolledAt: Date;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
  progress?: {
    overallCompletionPercentage: number;
    completedLessons: string[];
  };
}

interface Category {
  _id: string;
  categoryName: string;
  isActive: boolean;
}

interface FilterOptions {
  category: string;
  priceRange: string;
  language: string;
}

interface ApiResponse {
  success: boolean;
  courses: Course[];
  totalCourses: number;
  currentPage: number;
  totalPages: number;
  message?: string;
}

const StudentEnrolledCourses: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: '',
    priceRange: '',
    language: '',
  });
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [currentPage, itemsPerPage, searchTerm, sortBy, filterOptions]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/users/fetchallcategories');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>('/users/enrolled-courses', {
        withCredentials: true,
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortBy: sortBy,
          category: filterOptions.category,
          priceRange: filterOptions.priceRange,
          language: filterOptions.language,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch enrolled courses');
      }

      setCourses(response.data.courses || []);
      setTotalItems(response.data.totalCourses || 0);
      setCurrentPage(response.data.currentPage || 1);

      // Extract unique languages from courses
      if (response.data.courses && response.data.courses.length > 0) {
        const uniqueLanguages = [...new Set(response.data.courses.map((course) => course.language))] as string[];
        setLanguages(uniqueLanguages.filter(Boolean));
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch enrolled courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/studentdashboard');
  };

  const handleGoToCourse = (courseId: string) => {
    navigate(`/course/${courseId}/learn`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterOptions({
      category: '',
      priceRange: '',
      language: '',
    });
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <div className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="text-gray-600 hover:text-blue-900 transition-colors"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2">My Enrolled Courses</h1>
              </div>
              <p className="text-gray-600">View all the courses you are currently enrolled in</p>
            </div>
          </div>

          {/* Search, Sort, and Filter Section */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex w-full lg:w-1/3">
                <input
                  type="text"
                  placeholder="Search enrolled courses..."
                  className="w-full border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-4 py-2 rounded-r-lg hover:bg-blue-800 transition-colors"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </form>

              <div className="flex gap-3 w-full lg:w-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg w-full lg:w-auto border border-gray-200 hover:border-blue-300 transition-all">
                  <BiSort className="h-5 w-5 text-blue-800 mr-2" />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-transparent border-none focus:ring-0 text-gray-700 w-full cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="titleAsc">Title: A-Z</option>
                    <option value="titleDesc">Title: Z-A</option>
                  </select>
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilterMenu
                      ? 'bg-blue-900 text-white hover:bg-blue-800'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <FiFilter className="h-5 w-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Filter Options (Collapsible) */}
            {showFilterMenu && (
              <div className="mt-6 p-5 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="relative">
                      <select
                        value={filterOptions.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-3 pr-10 py-2 appearance-none bg-white shadow-sm"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="relative">
                      <select
                        value={filterOptions.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-3 pr-10 py-2 appearance-none bg-white shadow-sm"
                      >
                        <option value="">All Prices</option>
                        <option value="0-500">₹0 - ₹500</option>
                        <option value="500-1000">₹500 - ₹1000</option>
                        <option value="1000-2000">₹1000 - ₹2000</option>
                        <option value="2000+">₹2000+</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <div className="relative">
                      <select
                        value={filterOptions.language}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-3 pr-10 py-2 appearance-none bg-white shadow-sm"
                      >
                        <option value="">All Languages</option>
                        {languages.map((language, index) => (
                          <option key={index} value={language}>
                            {language}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors py-1 px-3 rounded-md hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FiBookOpen className="h-6 w-6 text-blue-900" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Enrolled Courses</p>
                  <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-gray-600">Loading enrolled courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
              <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FiBookOpen className="h-10 w-10 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Enrolled Courses</h3>
              <p className="text-gray-600 mb-6">You haven’t enrolled in any courses yet. Explore our courses to get started!</p>
              <button
                onClick={() => navigate('/studentdashboard')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 relative"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                        alt={course.title}
                        className="w-full h-52 object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${course.thumbnail}`);
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                        }}
                      />
                      <div className="absolute top-0 left-0 mt-3 ml-3">
                        <span className="bg-blue-900 text-white text-xs px-2 py-1 rounded-md">
                          {course.price === 0 ? 'FREE' : `₹${course.price}`}
                        </span>
                      </div>
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-md shadow-sm">
                          {course.language}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 relative">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {course.category?.categoryName || 'Uncategorized'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-medium mr-2 text-white">
                            {course.instructor?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-gray-600">{course.instructor?.name || 'Unknown'}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-2">
                        Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Status: {course.completionStatus}
                      </div>

                      {course.progress && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Progress</h4>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${course.progress.overallCompletionPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{course.progress.overallCompletionPercentage}% completed</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleGoToCourse(course._id)}
                        className="absolute bottom-5 right-5 bg-blue-900 text-white py-1 px-3 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                      >
                        Go to Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;