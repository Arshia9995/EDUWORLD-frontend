import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDollarSign, FiList, FiCreditCard, FiCalendar, FiInfo } from 'react-icons/fi';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface Transaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  courseId?: string;
  createdAt: string;
}

interface Wallet {
  balance: number;
  transactions: Transaction[];
}

const InstructorWallet: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/instructorwallet', {
        withCredentials: true,
      });

      if (response.data.success) {
        setWallet({
          balance: response.data.data.balance,
          transactions: response.data.data.transactions,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch wallet details');
      }
    } catch (err: any) {
      console.error('Error fetching wallet details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch wallet details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/instructordashboard');
  };

  const filteredTransactions = wallet.transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    return transaction.type === activeFilter;
  });

  // Calculate total earnings and spending
  const totalEarnings = wallet.transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpending = wallet.transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 bg-white rounded-full shadow-sm text-blue-900 hover:bg-blue-50 transition-colors"
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-blue-900">Wallet Dashboard</h1>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md flex items-center space-x-2 font-medium"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
            <p className="text-gray-500 mt-2 ml-11">Track your earnings and manage financial transactions</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading wallet details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Balance */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium opacity-90">Current Balance</h3>
                      <div className="p-2 bg-white bg-opacity-20 rounded-full">
                        <FiDollarSign className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">₹{wallet.balance.toFixed(2)}</div>
                    <p className="opacity-75 text-sm">Available for withdrawal</p>
                  </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Total Earnings</h3>
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <FiCreditCard className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">₹{totalEarnings.toFixed(2)}</div>
                    <p className="text-gray-500 text-sm">Lifetime earnings</p>
                  </div>
                </div>

                {/* Total Debits */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Total Debits</h3>
                      <div className="p-2 bg-red-100 text-red-600 rounded-full">
                        <FiInfo className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">₹{totalSpending.toFixed(2)}</div>
                    <p className="text-gray-500 text-sm">Total outgoing transactions</p>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 p-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-blue-900">Transaction History</h2>
                    
                    {/* Filter buttons */}
                    <div className="flex bg-white rounded-lg shadow-sm p-1">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeFilter === 'all'
                            ? 'bg-blue-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveFilter('credit')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeFilter === 'credit'
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Credits
                      </button>
                      <button
                        onClick={() => setActiveFilter('debit')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeFilter === 'debit'
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Debits
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="hover:bg-gray-50 transition-colors p-6 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {/* Fixed TypeScript error by using a single conditional render */}
                            {transaction.type === 'credit' ? (
                              <FiCreditCard className="h-6 w-6 text-green-600" />
                            ) : (
                              <FiInfo className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{transaction.description}</p>
                            <div className="flex items-center mt-1 text-gray-500 text-sm">
                              <FiCalendar className="mr-1 h-3 w-3" />
                              <span>{formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div
                            className={`text-lg font-bold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            transaction.type === 'credit' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-16">
                      <FiList className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">No transactions found</p>
                      <p className="text-gray-400">
                        {activeFilter !== 'all' 
                          ? `No ${activeFilter} transactions are available.` 
                          : 'Your transaction history will appear here.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorWallet;