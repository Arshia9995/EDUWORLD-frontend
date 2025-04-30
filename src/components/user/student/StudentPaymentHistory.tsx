import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiList, FiChevronLeft, FiRefreshCw } from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import Pagination from '../../../common/Pagination';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY!);

interface Payment {
  _id: string;
  userId: string;
  courseId: { _id: string; title: string };
  status: string;
  amount: number;
  stripeSessionId: string;
  createdAt: Date;
}

const StudentPaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [retryLoading, setRetryLoading] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/payment-history', {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch payment history');
      }

      setPaymentHistory(response.data.data);
    } catch (err: any) {
      console.error('Error fetching payment history:', err);
      setError(err.response?.data?.message || 'Failed to fetch payment history');
      toast.error(err.response?.data?.message || 'Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      setRetryLoading(paymentId);
      const response = await api.post(
        '/users/retry-payment',
        { paymentId },
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to retry payment');
      }

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Error retrying payment:', err);
      toast.error(err.response?.data?.message || 'Failed to retry payment');
    } finally {
      setRetryLoading(null);
    }
  };

  const handleRefresh = () => {
    setError(null);
    setCurrentPage(1);
    fetchPaymentHistory();
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/studentdashboard');
  };

  // Calculate paginated payments
  const totalItems = paymentHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = paymentHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-white">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <span
                onClick={handleBackToDashboard}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                Dashboard
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-blue-600 font-medium">Payment History</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-blue-800 transition-all"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
                  Payment History
                </h1>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                disabled={loading}
              >
                <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md p-10">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-gradient-to-tr from-blue-600 to-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiList className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-700 text-xl mt-6 font-semibold">Loading payment history...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your records.</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-4">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-red-800 font-semibold text-lg">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiList className="mr-2 text-blue-600" />
                Payment History
              </h2>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FiList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No payment history available.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your payment records will appear here once you make a purchase.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            SI No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedPayments.map((payment, index) => (
                          <tr
                            key={payment._id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => console.log('View payment details:', payment._id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {startIndex + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">
                                {payment.courseId.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">₹{payment.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  payment.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : payment.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : payment.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {payment.status === 'pending' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetryPayment(payment._id);
                                  }}
                                  className={`px-3 py-1 text-sm font-medium text-white rounded-md ${
                                    retryLoading === payment._id
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-blue-600 hover:bg-blue-700'
                                  }`}
                                  disabled={retryLoading === payment._id}
                                >
                                  {retryLoading === payment._id ? 'Retrying...' : 'Retry Payment'}
                                </button>
                              )}
                              {payment.status === 'completed' && (
                                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-md">
                                  Payment Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentHistory;