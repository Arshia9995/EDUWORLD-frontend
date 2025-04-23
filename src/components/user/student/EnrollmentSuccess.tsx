// // // src/pages/EnrollmentSuccess.tsx
// // import { useEffect } from 'react';
// // import { useSearchParams, useNavigate } from 'react-router-dom';
// // import { api } from '../../../config/api';
// // import toast from 'react-hot-toast';

// // const EnrollmentSuccess = () => {
// //   const [searchParams] = useSearchParams();
// //   const navigate = useNavigate();
// //   const sessionId = searchParams.get('session_id');
// //   const courseId = searchParams.get('course_id');

// // //   useEffect(() => {
// // //     const verifyPayment = async () => {
// // //       if (sessionId && courseId) {
// // //         try {
// // //           const response = await api.get(`/users/verify-payment?session_id=${sessionId}`);
// // //           if (response.data.success) {
// // //             toast.success('Enrollment successful!');
// // //             // Redirect to course or dashboard after a delay
// // //             setTimeout(() => navigate(`/course/${courseId}/learn`), 2000);
// // //           }
// // //         } catch (error: any) {
// // //           console.error('Error verifying payment:', error);
// // //           toast.error(error.response?.data?.message || 'Failed to verify payment');
// // //         }
// // //       } else {
// // //         toast.error('Invalid session or course ID');
// // //         navigate('/');
// // //       }
// // //     };

// // //     verifyPayment();
// // //   }, [sessionId, courseId, navigate]);


// // useEffect(() => {
// //     const verifyPayment = async () => {
// //       const sessionId = searchParams.get('session_id');
// //       const courseId = searchParams.get('course_id');
// //       if (!sessionId || !courseId) {
// //         console.error('Missing sessionId or courseId:', { sessionId, courseId });
// //         toast.error('Invalid session or course ID');
// //         navigate('/');
// //         return;
// //       }
  
// //       try {
// //         console.log('Verifying payment with sessionId:', sessionId, 'and courseId:', courseId);
// //         const response = await api.get(`/users/verify-payment?session_id=${sessionId}`);
// //         if (response.data.success) {
// //           toast.success(response.data.message);
// //           navigate(`/course/${courseId}/learn`);
// //         }
// //       } catch (error: any) {
// //         console.error('Full error verifying payment:', error.response ? error.response.data : error.message);
// //         toast.error(error.response?.data?.message || error.message || 'Failed to verify payment');
// //         navigate('/');
// //       }
// //     };
  
// //     verifyPayment();
// //   }, [searchParams, navigate]);

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="text-center p-6 bg-white rounded-lg shadow-md">
// //         <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
// //         <p className="text-gray-600">Verifying your enrollment...</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EnrollmentSuccess;




// import { useEffect, useRef } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { api } from '../../../config/api';
// import toast from 'react-hot-toast';

// const EnrollmentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const hasVerified = useRef(false); // Flag to prevent multiple executions
//   const sessionIdRef = useRef(searchParams.get('session_id')); // Capture initial values
//   const courseIdRef = useRef(searchParams.get('course_id'));

//   useEffect(() => {
//     // Only run if verification hasn't occurred yet
//     if (hasVerified.current) return;

//     console.log('useEffect running with sessionId:', sessionIdRef.current, 'courseId:', courseIdRef.current);

//     const verifyPayment = async () => {
//       const sessionId = sessionIdRef.current;
//       const courseId = courseIdRef.current;

//       if (!sessionId || !courseId) {
//         console.error('Missing sessionId or courseId:', { sessionId, courseId });
//         toast.error('Invalid session or course ID');
//         navigate('/');
//         return;
//       }

//       try {
//         console.log('Verifying payment with sessionId:', sessionId, 'and courseId:', courseId);
//         const response = await api.get(`/users/verify-payment?session_id=${sessionId}`);
//         console.log('API response:', response.data);
//         if (response.data.success) {
//           toast.success('Enrollment successful!', { id: 'enrollment-success' }); // Unique ID to prevent duplicates
//           // Slight delay to ensure component unmounts before navigation
//           setTimeout(() => navigate(`/course/${courseId}/learn`), 100);
//         }
//       } catch (error: any) {
//         console.error('Full error verifying payment:', error.response ? error.response.data : error.message);
//         toast.error(error.response?.data?.message || error.message || 'Failed to verify payment');
//         navigate('/');
//       } finally {
//         hasVerified.current = true; // Mark as verified to prevent re-execution
//       }
//     };

//     verifyPayment();
//   }, [navigate]); // Only re-run if navigate changes (shouldn't happen)

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-center p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
//         <p className="text-gray-600">Verifying your enrollment...</p>
//       </div>
//     </div>
//   );
// };

// export default EnrollmentSuccess;

//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

const EnrollmentSuccess = () => {
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
        navigate('/');
        return;
      }

      try {
        const response = await api.get(`/users/verify-payment?session_id=${sessionId}`);
        if (response.data.success) {
          toast.success('Enrollment successful!', { id: 'enrollment-success' });
          navigate("/enrolled-courses");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to verify payment');
        navigate('/');
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
        <p className="text-gray-600">Verifying your enrollment...</p>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;


