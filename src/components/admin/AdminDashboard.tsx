import React, { useState, useEffect } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import { api } from "../../config/api";
import Chart from 'chart.js/auto';
import Pagination from "../../common/Pagination";


interface EnrollmentTimelineItem {
  _id: string; 
  count: number;
}

interface CourseDistributionItem {
  categoryName: string;
  count: number;
}

interface TopCourse {
  courseName: string;
  instructorName: string;
  categoryName: string;
  enrollmentCount: number;
}

interface CourseStat {
  _id: string;
  title: string;
  enrolledStudents: number;
  price: number;
  instructorName: string;
  categoryName: string;
  status: string;
}

interface AdminStats {
  enrollmentTimeline: EnrollmentTimelineItem[];
  courseDistribution: CourseDistributionItem[];
  totalInstructors: number;
  totalCourses: number;
  totalStudents: number;
  topCourses: TopCourse[];
}

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    enrollmentTimeline: [],
    courseDistribution: [],
    totalInstructors: 0,
    totalCourses: 0,
    totalStudents: 0,
    topCourses: [],
  });
  const [courseStats, setCourseStats] = useState<CourseStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); 

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const adminStatsResponse = await api.get('/admin/admin-stats', { withCredentials: true });
        if (adminStatsResponse.data.success) {
          setStats({
            enrollmentTimeline: adminStatsResponse.data.data.enrollmentTimeline || [],
            courseDistribution: adminStatsResponse.data.data.courseDistribution || [],
            totalInstructors: adminStatsResponse.data.data.totalInstructors || 0,
            totalCourses: adminStatsResponse.data.data.totalCourses || 0,
            totalStudents: adminStatsResponse.data.data.totalStudents || 0,
            topCourses: adminStatsResponse.data.data.topCourses || [],
          });
        } else {
          throw new Error(adminStatsResponse.data.message);
        }

        
        const courseStatsResponse = await api.get('/admin/course-stats', { withCredentials: true });
        if (courseStatsResponse.data.success) {
          setCourseStats(courseStatsResponse.data.data || []);
        } else {
          throw new Error(courseStatsResponse.data.message);
        }
      } catch (err: any) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

 
  useEffect(() => {
    if (!stats.enrollmentTimeline.length || loading) return;

    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      labels.unshift(`${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`);
      const entry = stats.enrollmentTimeline.find((e) => e._id === monthKey);
      data.unshift(entry ? entry.count : 0);
    }

    const existingChart = Chart.getChart('enrollmentChart');
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Enrollments',
            data,
            borderColor: '#6366F1', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366F1',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Enrollments', font: { size: 12, weight: 500 } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 } },
          },
          x: {
            title: { display: true, text: 'Month', font: { size: 12, weight: 500 } },
            grid: { display: false },
            ticks: { maxRotation: 45, minRotation: 45, autoSkip: true, maxTicksLimit: 6, font: { size: 10 } },
          },
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 12 }, usePointStyle: true } },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 12 },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (tooltipItems) => tooltipItems[0].label,
              label: (context) => `Enrollments: ${context.parsed.y}`,
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }, [stats, loading]);

  
  useEffect(() => {
    if (!stats.courseDistribution.length || loading) return;

    const labels = stats.courseDistribution.map((d) => d.categoryName);
    const data = stats.courseDistribution.map((d) => d.count);
    const colors = [
      '#8B5CF6', 
      '#EC4899', 
      '#06B6D4', 
      '#10B981', 
      '#F59E0B', 
      '#EF4444', 
      '#3B82F6', 
    ];

    const backgroundColors = data.map((_, index) => colors[index % colors.length]);

    const existingChart = Chart.getChart('courseDistributionChart');
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('courseDistributionChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Courses',
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Courses', font: { size: 12, weight: 500 } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 }, stepSize: 1 },
          },
          x: {
            title: { display: true, text: 'Category', font: { size: 12, weight: 500 } },
            grid: { display: false },
            ticks: { font: { size: 10 } },
          },
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 12 }, usePointStyle: true } },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 12 },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (tooltipItems) => tooltipItems[0].label,
              label: (context) => `Courses: ${context.parsed.y}`,
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }, [stats, loading]);

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courseStats.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = courseStats.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6 lg:p-8">
         
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <svg className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-indigo-600">Overview</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage your learning platform
                </p>
              </div>

              {/* <div className="mt-4 md:mt-0">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div> */}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <p className="text-red-600 mt-2 pl-9">Please try refreshing the page or contact system administrator.</p>
            </div>
          ) : (
            <>
             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">{stats.totalStudents}</span>
                    <span className="ml-2 text-xs text-gray-500 font-medium">Enrolled</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center text-green-500 font-medium">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Active Users
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Instructors</h3>
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">{stats.totalInstructors}</span>
                    <span className="ml-2 text-xs text-gray-500 font-medium">Active</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center text-indigo-500 font-medium">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified Educators
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.169 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">{stats.totalCourses}</span>
                    <span className="ml-2 text-xs text-gray-500 font-medium">Created</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center text-green-500 font-medium">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Course
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">
                      {stats.enrollmentTimeline.length > 0 ? stats.enrollmentTimeline[0].count : 0}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 font-medium">New Enrollments</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center text-purple-500 font-medium">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Analytics
                      </span>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Enrollments (Last 12 Months)</h2>
                    <p className="text-sm text-gray-500 mt-1">Monthly enrollment statistics</p>
                  </div>
                  <div className="p-6">
                    <div className="h-72">
                      <canvas id="enrollmentChart"></canvas>
                    </div>
                  </div>
                </div>

               
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Courses by Category</h2>
                    <p className="text-sm text-gray-500 mt-1">Distribution across categories</p>
                  </div>
                  <div className="p-6">
                    <div className="h-72">
                      <canvas id="courseDistributionChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Course Statistics</h2>
                    <p className="text-sm text-gray-500 mt-1">Detailed statistics for all courses</p>
                  </div>
                </div>
                {courseStats.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.447l5-2a1 1 0 011.45 1.053l-1 2a1 1 0 001.788 0l7-14a1 1 0 00-1.169-1.447l-5 2a1 1 0 01-1.45-1.053l1-2z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-600 font-medium text-lg">No course statistics available</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                      Course statistics will appear here once courses are created
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                      Create Your First Course
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentCourses.map((course) => (
                          <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">{course.title}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">{course.enrolledStudents}</span>
                                <div className="ml-2 flex items-center text-green-500">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                  </svg>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">₹{course.price.toFixed(2)}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{course.instructorName || 'N/A'}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {course.categoryName}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  course.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {course.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, totalItems)}
                      </span>{" "}
                      of <span className="font-medium">{totalItems}</span> courses
                    </p>
                  </div>
                </div>
                {courseStats.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

             
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Top Performing 5 Courses</h2>
                    <p className="text-sm text-gray-500 mt-1">Courses with highest enrollment rates</p>
                  </div>
                </div>
                {stats.topCourses.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.447l5-2a1 1 0 011.45 1.053l-1 2a1 1 0 001.788 0l7-14a1 1 0 00-1.169-1.447l-5 2a1 1 0 01-1.45-1.053l1-2z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-600 font-medium text-lg">No courses available</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                      Courses will appear here once they are created and enrolled in
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                      Create Your First Course
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.topCourses.map((course, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">{course.courseName}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{course.instructorName}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {course.categoryName}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">{course.enrollmentCount}</span>
                                <div className="ml-2 flex items-center text-green-500">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                  </svg>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-medium">{stats.topCourses.length}</span> courses
                    </p>
                  </div>
                </div>
              </div>

             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add Course</h3>
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-indigo-100 text-sm mb-4">Create a new course for your platform</p>
                  <button className="w-full mt-2 bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                    Create Course
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Manage Users</h3>
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-green-100 text-sm mb-4">View and manage platform users</p>
                  <button className="w-full mt-2 bg-white text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                    User Management
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Reports</h3>
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm mb-4">Generate detailed platform reports</p>
                  <button className="w-full mt-2 bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                    View Reports
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Settings</h3>
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-4">Configure platform settings</p>
                  <button className="w-full mt-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    Open Settings
                  </button>
                </div>
              </div>

             
              <div className="mt-12 text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                <p>© {new Date().getFullYear()} Your Learning Platform. All rights reserved.</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;