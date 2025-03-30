import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMessageSquare, FiBell, FiPlus, FiBookOpen, FiEdit, FiFilter, FiSearch, FiFilePlus } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import InstructorSidebar from '../../../common/InstructorSidebar';
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
  duration?: string;
  lessons: string[];
  rating?: number;
  isPublished: boolean;
  instructor: { _id: string; name: string };
  isBlocked: boolean;
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

const InstructorCourselist: React.FC = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPublishedCourses();
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

  const fetchPublishedCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/getpublishedcourses', {
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

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch courses');
      }

      setCourses(response.data.courses || []);
      setTotalItems(response.data.totalCourses || 0);
      
      // Extract unique languages from courses
      if (response.data.courses && response.data.courses.length > 0) {
        const uniqueLanguages = [...new Set(response.data.courses.map((course: Course) => course.language))] as string[];
        setLanguages(uniqueLanguages.filter(Boolean));
      }
    } catch (err: any) {
      console.error('Error fetching published courses:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    navigate('/instructoraddcourse');
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/instructor/course/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/instructor/editcourse/${courseId}`);
  };

  const handleAddLesson = (courseId: string) => {
    navigate(`/instructoraddlesson`, { state: { courseId } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterType]: value
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
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full text-blue-900 hover:bg-blue-50 mr-4"
            >
              {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold text-blue-900 hidden md:block">My Courses</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full text-blue-900 hover:bg-blue-50 relative">
              <FiMessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-blue-900 hover:bg-blue-50 relative">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-medium">
              ID
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-2">My Published Courses</h1>
              <p className="text-gray-600">Manage and track all your published course content</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateCourse}
                className="flex items-center space-x-2 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                <FiPlus className="h-5 w-5" />
                <span>Create Course</span>
              </button>
            </div>
          </div>

          {/* Search, Sort and Filter Section */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex w-full lg:w-1/3">
                <input
                  type="text"
                  placeholder="Search courses..."
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
                        <option value="free">Free</option>
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

                {/* Clear Filters Button */}
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
                  <p className="text-gray-500 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-gray-600">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
              <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FiBookOpen className="h-10 w-10 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Published Courses Yet</h3>
              <p className="text-gray-600 mb-6">
                {(searchTerm || filterOptions.category || filterOptions.priceRange || filterOptions.language) ? 
                  'No courses match your search criteria. Try adjusting your filters or search term.' : 
                  'Start creating your first course to share your knowledge with students worldwide.'}
              </p>
              {(searchTerm || filterOptions.category || filterOptions.priceRange || filterOptions.language) ? (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters and try again
                </button>
              ) : (
                <button
                  onClick={handleCreateCourse}
                  className="bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                >
                  Create Your First Course
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 relative"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                        alt={course.title}
                        className="w-full h-52 object-cover cursor-pointer"
                        onError={(e) => {
                          console.error(`Failed to load image: ${course.thumbnail}`);
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                        }}
                        onClick={() => handleViewCourse(course._id)}
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

                    <div className="p-5">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {course.category?.categoryName || 'Uncategorized'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">• {course.lessons?.length || 0} Lessons</span>
                      </div>
                      <h3
                        className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer"
                        onClick={() => handleViewCourse(course._id)}
                      >
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-medium mr-2 text-white">
                            {course.instructor?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-gray-600">{course.instructor?.name || 'Unknown'}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLesson(course._id);
                          }}
                          className="flex items-center space-x-1 bg-yellow-500 text-white py-1 px-3 rounded-full hover:bg-yellow-600 transition-colors"
                          title="Add Lesson"
                        >
                          <FiFilePlus className="h-4 w-4" />
                          <span className="text-sm">Add Lesson</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCourse(course._id);
                          }}
                          className="flex items-center space-x-1 bg-blue-900 text-white py-1 px-3 rounded-full hover:bg-blue-800 transition-colors"
                          title="Edit Course"
                        >
                          <FiEdit className="h-4 w-4" />
                          <span className="text-sm">Edit Course</span>
                        </button>
                      </div>
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

export default InstructorCourselist;