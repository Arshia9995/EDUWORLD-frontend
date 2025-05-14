import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../common/AdminSidebar';
import { api } from '../../config/api';
import Pagination from '../../common/Pagination';

interface PaymentHistoryItem {
  _id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  paymentDate: string;
  status: string;
  instructorName: string;
  instructorShare: number;
  adminShare: number;
  type: string;
}

const AdminPaymentHistory: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/get-all-payment-history?page=${currentPage}&limit=${itemsPerPage}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setPayments(response.data.data.payments || []);
          setTotalItems(response.data.data.total || 0);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        setError('Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      }
    };

    const config = statusConfig[status.toLowerCase()] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } p-6 lg:p-8`}
      >
      
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Admin</span>
            <svg className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-indigo-600">Payment History</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <svg className="h-7 w-7 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                View all student payment transactions and financial records
              </p>
            </div>
            
            {!loading && !error && payments.length > 0 && (
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-gray-500 text-xs uppercase font-medium">Total Records</div>
                  <div className="text-2xl font-bold text-gray-800">{totalItems}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs uppercase font-medium">Page</div>
                  <div className="text-2xl font-bold text-gray-800">{currentPage} / {Math.ceil(totalItems / itemsPerPage)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center border border-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading payment history...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your records</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-red-50 border-b border-red-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-red-800">Error Loading Data</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">{error}</h3>
                  <p className="text-red-600 mt-1">Please try refreshing the page or contact system administrator.</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">All Payments</h2>
                <p className="text-sm text-gray-500 mt-1">Detailed payment transactions for all students</p>
              </div>
              {payments.length > 0 && (
                <div className="lg:hidden text-center">
                  <div className="text-gray-500 text-xs uppercase font-medium">Records</div>
                  <div className="text-lg font-bold text-gray-800">{totalItems}</div>
                </div>
              )}
            </div>
            
            {payments.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <svg className="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.447l5-2a1 1 0 011.45 1.053l-1 2a1 1 0 001.788 0l7-14a1 1 0 00-1.169-1.447l-5 2a1 1 0 01-1.45-1.053l1-2z" />
                  </svg>
                </div>
                <h3 className="text-gray-700 font-medium text-xl">No payment records available</h3>
                <p className="text-gray-500 text-base mt-2 max-w-md mx-auto">
                  Payment records will appear here once student transactions are made. Check back later.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor Share</th>
                      <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-800">{payment.studentName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-800 max-w-xs truncate" title={payment.courseTitle}>
                            {payment.courseTitle}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-800">{formatCurrency(payment.amount)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{formatDate(payment.paymentDate)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{payment.instructorName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{payment.instructorShare ? formatCurrency(payment.instructorShare) : 'N/A'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{formatCurrency(payment.adminShare)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {payments.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> payments
                  </p>
                  
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
        )}
      </main>
    </div>
  );
};

export default AdminPaymentHistory;