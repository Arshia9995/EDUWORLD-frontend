// src/components/student/EnrollmentFailure.tsx
import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';

const EnrollmentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const courseId = searchParams.get('course_id');
  const errorMessage = searchParams.get('error_message') || 'Payment was not completed';

  useEffect(() => {
    if (hasProcessed.current) return;

    // Display the error message from query params or a default one
    toast.error(errorMessage, { id: 'enrollment-failure' });
    hasProcessed.current = true;
  }, [errorMessage]);

  const handleRetryPayment = () => {
    if (courseId) {
      // Redirect to the course details page or trigger a new checkout session
      navigate(`/retry`);
    } else {
      navigate('/courses');
    }
  };

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="flex justify-center mb-4">
          <FiAlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {courseId && (
            <button
              onClick={handleRetryPayment}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Retry Payment
            </button>
          )}
          <button
            onClick={handleBackToCourses}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFailure;