import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, Bell, DollarSign, Clock, TrendingUp, CreditCard, BookOpen, Users, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { api } from '../../../config/api';
import Chart from 'chart.js/auto';

const InstructorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [walletData, setWalletData] = useState<{ balance: number; transactions: any[] }>({
    balance: 0,
    transactions: [],
  });
  const [statsData, setStatsData] = useState<{
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
    courseCreationData: { _id: string; count: number }[];
  }>({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    courseCreationData: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        
        const walletResponse = await api.get('/users/instructorwallet', { withCredentials: true });
        if (walletResponse.data.success) {
          
          console.log('API Response Transactions:', walletResponse.data.data.transactions); // Added log
          
          const uniqueTransactions = Array.from(
            new Map(
              walletResponse.data.data.transactions.map((t: any) => [
                [t.createdAt, t.amount, t.description].join('|'),
                t,
              ])
            ).values()
          );
          setWalletData({ ...walletResponse.data.data, transactions: uniqueTransactions });
        } else {
          throw new Error(walletResponse.data.message);
        }

        
        const statsResponse = await api.get('/users/instructor-stats', { withCredentials: true });
        if (statsResponse.data.success) {
          setStatsData(statsResponse.data.data);
        } else {
          throw new Error(statsResponse.data.message);
        }
      } catch (err: any) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 
  useEffect(() => {
    if (!walletData.transactions.length || loading) return;

    const today = new Date();
    const twelveWeeksAgo = new Date(today);
    twelveWeeksAgo.setDate(today.getDate() - 12 * 7);

    const incomeByWeek = walletData.transactions
      .filter((t) => t.type === 'credit' && t.courseId)
      .filter((t) => new Date(t.createdAt) >= twelveWeeksAgo)
      .reduce((acc, t) => {
        const date = new Date(t.createdAt);
        const dayOfWeek = date.getDay();
        const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - daysSinceMonday);
        const weekKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}/${weekStart.getFullYear()}`;
        acc[weekKey] = (acc[weekKey] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const labels: string[] = [];
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 7);
      const dayOfWeek = date.getDay();
      const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - daysSinceMonday);
      const weekKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}/${weekStart.getFullYear()}`;
      labels.unshift(weekKey);
      data.unshift(incomeByWeek[weekKey] || 0);
    }

    const existingChart = Chart.getChart('incomeChart');
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Weekly Income (60% Course Revenue)',
            data,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
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
            title: { display: true, text: 'Income ($)', font: { size: 12, weight: 500 } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 }, callback: (value) => `$${value}` },
          },
          x: {
            title: { display: true, text: 'Week Starting', font: { size: 12, weight: 500 } },
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
              title: (tooltipItems) => `Week Starting: ${tooltipItems[0].label}`,
              label: (context) => `Income: $${context.parsed.y.toFixed(2)}`,
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }, [walletData, loading]);

  
  useEffect(() => {
    if (!statsData.courseCreationData.length || loading) return;

    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const courseCreationByMonth = statsData.courseCreationData.reduce((acc, entry) => {
      acc[entry._id] = entry.count;
      return acc;
    }, {} as Record<string, number>);

    const labels: string[] = [];
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      labels.unshift(`${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`);
      data.unshift(courseCreationByMonth[monthKey] || 0);
    }

    const existingChart = Chart.getChart('courseCreationChart');
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('courseCreationChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Courses Created',
            data,
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 1,
            borderRadius: 6,
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
              label: (context) => `Courses: ${context.parsed.y}`,
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }, [statsData, loading]);

  const getTotalIncome = () => {
    return walletData.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getLastMonthIncome = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    return walletData.transactions
      .filter(t => t.type === 'credit' && new Date(t.createdAt) >= lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const getMonthlyChangePercent = () => {
    const today = new Date();
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const lastMonthIncome = walletData.transactions
      .filter(t => t.type === 'credit' && 
        new Date(t.createdAt) >= lastMonth && 
        new Date(t.createdAt) < today)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const prevMonthIncome = walletData.transactions
      .filter(t => t.type === 'credit' && 
        new Date(t.createdAt) >= twoMonthsAgo && 
        new Date(t.createdAt) < lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (prevMonthIncome === 0) return { percent: 100, increase: true };
    
    const change = ((lastMonthIncome - prevMonthIncome) / prevMonthIncome) * 100;
    return { percent: Math.abs(change), increase: change >= 0 };
  };

  
  console.log('Component Rendered with Transactions:', walletData.transactions); 

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
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-3">Instructor Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-medium shadow-sm">
              IS
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
            <X className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="p-6 lg:p-8">
          {/* Welcome Section with Quick Actions */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, Instructor!</h2>
              <p className="text-gray-600 mt-1">Here's an overview of your earnings, courses, and recent activity.</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                Create New Course
              </button>
              {/* <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                <DollarSign className="h-4 w-4 mr-2" />
                Withdraw Funds
              </button> */}
            </div>
          </div>

          {/* Stats Cards - First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Balance Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm p-6 border border-indigo-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-indigo-800">Current Balance</h3>
                <div className="p-2 bg-indigo-600 bg-opacity-10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-indigo-100 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">₹{walletData.balance.toFixed(2)}</span>
                  <span className="ml-2 text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full">Available</span>
                </div>
              )}
              <button className="mt-4 w-full flex items-center justify-center px-3 py-2 border border-indigo-200 text-sm font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-colors">
                <span>Manage Balance</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm p-6 border border-green-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-800">Total Earnings</h3>
                <div className="p-2 bg-green-600 bg-opacity-10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-green-100 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">₹{getTotalIncome().toFixed(2)}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">Lifetime</span>
                </div>
              )}
              <div className="mt-4 bg-green-50 rounded-lg p-2 text-sm text-green-700 flex items-center">
                <span>You're in the top 20% of instructors</span>
              </div>
            </div>

            {/* Last 30 Days Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-blue-800">Last 30 Days</h3>
                <div className="p-2 bg-blue-600 bg-opacity-10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-blue-100 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">₹{getLastMonthIncome().toFixed(2)}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">Earnings</span>
                </div>
              )}
              {!loading && (
                <div className="mt-4 flex items-center text-sm">
                  { getMonthlyChangePercent().increase ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={getMonthlyChangePercent().increase ? "text-green-600" : "text-red-600"}>
                    {getMonthlyChangePercent().percent.toFixed(1)}% 
                  </span>
                  <span className="text-gray-500 ml-1">vs previous month</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards - Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">{statsData.totalCourses}</span>
                    <span className="ml-2 text-xs text-gray-500 font-medium">Created</span>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <div className="w-full mt-2 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${statsData.publishedCourses / Math.max(statsData.totalCourses, 1) * 100}%` }}></div>
                    </div>
                    <span className="ml-2">{statsData.publishedCourses} Published</span>
                  </div>
                </div>
              )}
            </div>

            {/* Published Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Published Courses</h3>
                <div className="p-2 bg-teal-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-800">{statsData.publishedCourses}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium">Live</span>
                </div>
              )}
              {!loading && statsData.totalCourses > 0 && (
                <div className="mt-2 flex items-center text-xs">
                  <span className="text-teal-600 font-medium">
                    {Math.round(statsData.publishedCourses / statsData.totalCourses * 100)}%
                  </span>
                  <span className="text-gray-500 ml-1">publication rate</span>
                </div>
              )}
            </div>

            {/* Total Students Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-800">{statsData.totalStudents}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium">Enrolled</span>
                </div>
              )}
              {!loading && statsData.publishedCourses > 0 && (
                <div className="mt-2 flex items-center text-xs">
                  <span className="text-orange-600 font-medium">
                    {Math.round(statsData.totalStudents / statsData.publishedCourses)}
                  </span>
                  <span className="text-gray-500 ml-1">students per course (avg)</span>
                </div>
              )}
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-800">{walletData.transactions.length}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium">Transactions</span>
                </div>
              )}
              {!loading && walletData.transactions.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Last transaction: {walletData.transactions.length > 0 ? formatDate(walletData.transactions[0].createdAt) : 'No data'}
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income Graph */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Weekly Income (Last 12 Weeks)</h2>
                <div className="text-xs bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-medium">
                  60% of course payments
                </div>
              </div>
              {loading ? (
                <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading chart data...</p>
                  </div>
                </div>
              ) : walletData.transactions.length === 0 ? (
                <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No income data available yet</p>
                    <p className="text-gray-400 text-sm mt-1">Income will appear here once you start earning from courses</p>
                  </div>
                </div>
              ) : (
                <div className="h-72">
                  <canvas id="incomeChart"></canvas>
                </div>
              )}
            </div>

            {/* Course Creation Graph */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Courses Created (Last 12 Months)</h2>
                <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 font-medium transition-colors">
                  View Details
                </button>
              </div>
              {loading ? (
                <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading chart data...</p>
                  </div>
                </div>
              ) : statsData.courseCreationData.length === 0 ? (
                <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No courses created yet</p>
                    <p className="text-gray-400 text-sm mt-1">Course creation data will appear here once you create courses</p>
                    <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center mx-auto">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Your First Course
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-72">
                  <canvas id="courseCreationChart"></canvas>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          {!loading && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Recent 5 Transactions</h2>
                  <p className="text-xs text-gray-500 mt-1">Latest financial activity on your instructor account</p>
                </div>
                {/* {walletData.transactions.length > 5 && (
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                )} */}
              </div>
              
              {walletData.transactions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No transactions yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here</p>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Set Up Payment Method
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {walletData.transactions.slice(0, 5).map((t, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
                            {formatDate(t.createdAt)}
                          </td>
                          <td
                            className={`py-4 px-4 text-sm font-medium whitespace-nowrap ${
                              t.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {t.type === 'credit' ? '+' : '-'}₹{t.amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">{t.description}</td>
                          <td className="py-4 px-4 text-sm">
                            {t.courseId ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Course Payment
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <DollarSign className="h-3 w-3 mr-1" />
                                System
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Quick Links & Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">My Courses</p>
                    <p className="text-xs text-gray-500">Manage your course catalog</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Students</p>
                    <p className="text-xs text-gray-500">View and manage your students</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <DollarSign className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Earnings</p>
                    <p className="text-xs text-gray-500">Track your revenue and payouts</p>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Tips & Guides */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm p-6 border border-indigo-100 hover:shadow-md transition-all duration-300 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips to Increase Your Earnings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 text-indigo-600 mr-2" />
                    Create Engaging Content
                  </h4>
                  <p className="text-sm text-gray-600">Interactive content leads to better reviews and higher student retention.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Users className="h-4 w-4 text-indigo-600 mr-2" />
                    Build Your Audience
                  </h4>
                  <p className="text-sm text-gray-600">Share course previews on social media to attract more students.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 text-indigo-600 mr-2" />
                    Optimize Your Pricing
                  </h4>
                  <p className="text-sm text-gray-600">Test different price points to find the sweet spot for your courses.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 text-indigo-600 mr-2" />
                    Engage With Students
                  </h4>
                  <p className="text-sm text-gray-600">Respond to questions promptly to encourage positive reviews.</p>
                </div>
              </div>
              <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View More Tips
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500">
              <p>© 2025 Learning Platform. All rights reserved.</p>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;