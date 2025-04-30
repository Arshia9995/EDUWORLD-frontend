import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

const RetryPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const sessionIdRef = useRef(searchParams.get('session_id'));
  const courseIdRef = useRef(searchParams.get('course_id'));

  useEffect(() => {
    if (hasVerified.current) return;

    const verifyPayment = async () => {
      const sessionId = sessionIdRef.current;
      const courseId = courseIdRef.current;

      if (!sessionId || !courseId) {
        toast.error('Invalid session or course ID');
        navigate('/payment-history');
        return;
      }

      try {
        const response = await api.get(`/users/verify-payment?session_id=${sessionId}`);
        if (response.data.success) {
          toast.success('Payment retry successful!', { id: 'retry-payment-success' });
          navigate('/enrolled-courses');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to verify payment');
        navigate('/payment-history');
      } finally {
        hasVerified.current = true;
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default RetryPaymentSuccess;