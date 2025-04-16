// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   FiArrowLeft, FiBookOpen, FiClock, FiPlayCircle, 
//   FiGlobe, FiTag, FiUser, FiCheckCircle 
// } from 'react-icons/fi';
// import StudentSidebar from '../../../common/StudentSidebar';
// import { api } from '../../../config/api';
// import toast from 'react-hot-toast';

// interface Lesson {
//   _id: string;
//   lessonNumber: number;
//   title: string;
//   description: string;
//   video: string;
//   duration?: string;
//   course: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail?: string;
//   category: { _id: string; categoryName: string; isActive: boolean };
//   price: number;
//   language: string;
//   duration?: string;
//   lessons: string[]; 
//   rating?: number;
//   isPublished: boolean;
//   instructor: { _id: string; name: string };
//   isBlocked: boolean;
//   enrolledAt: Date;
//   completionStatus: 'enrolled' | 'in-progress' | 'completed';
// }

// const StudentEnrolledCourseDetails: React.FC = () => {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [course, setCourse] = useState<Course | null>(null);
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRefreshingThumbnail, setIsRefreshingThumbnail] = useState<boolean>(false);
//   const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());
//   const [activeLesson, setActiveLesson] = useState<string | null>(null);

//   const fetchCourseDetails = async () => {
//     if (!courseId) {
//       setError('Course ID is missing');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       // First get the course details
//       const courseResponse = await api.get(`/users/getcoursebyid/${courseId}`, {
//         withCredentials: true,
//       });

//       if (courseResponse.status !== 200) {
//         throw new Error(courseResponse.data.message || 'Failed to fetch course details');
//       }

//       const courseData = courseResponse.data.course;

//       // Then get the lessons for this course
//       if (courseData.lessons && courseData.lessons.length > 0) {
//         const lessonsResponse = await api.get(`/users/getlessonbycourseid/${courseId}`, {
//           withCredentials: true,
//         });

//         if (lessonsResponse.status !== 200) {
//           throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
//         }

//         const sortedLessons = (lessonsResponse.data.lessons || []).sort(
//           (a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber
//         );
        
//         setLessons(sortedLessons);
        
//         if (sortedLessons.length > 0) {
//           setActiveLesson(sortedLessons[0]._id);
//         }
//       } else {
//         setLessons([]);
//       }

//       setCourse(courseData);
//     } catch (err: any) {
//       console.error('Error fetching course details:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourseDetails();
//   }, [courseId]);

//   const handleVideoError = async (lessonId: string) => {
//     if (!refreshingVideos.has(lessonId)) {
//       setRefreshingVideos((prev) => new Set(prev).add(lessonId));
//       try {
//         const lesson = lessons.find((l) => l._id === lessonId);
//         if (!lesson || !lesson.video) return;

//         const fileName = lesson.video.split('/').pop();
//         if (!fileName) {
//           console.error('Could not extract filename from video URL:', lesson.video);
//           return;
//         }

//         const { data } = await api.post('/users/get-s3-url', {
//           fileName: fileName,
//           fileType: 'video/*',
//           getUrl: true,
//         });

//         setLessons((prev) =>
//           prev.map((l) =>
//             l._id === lessonId ? { ...l, video: data.downloadUrl } : l
//           )
//         );
//       } catch (error) {
//         console.error('Error refreshing video URL:', error);
//         toast.error('Failed to refresh video');
//       } finally {
//         setRefreshingVideos((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(lessonId);
//           return newSet;
//         });
//       }
//     }
//   };

//   const handleBack = () => {
//     navigate('/enrolled-courses');
//   };

//   // User progress tracking
//   const updateLessonProgress = async (lessonId: string) => {
//     try {
//       await api.post('/users/update-lesson-progress', {
//         courseId,
//         lessonId,
//         status: 'completed'
//       }, {
//         withCredentials: true
//       });
      
//       // You can update UI to reflect completion if needed
//     } catch (error) {
//       console.error('Failed to update lesson progress:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div
//           className="flex-1 min-w-0 flex items-center justify-center"
//           style={{
//             marginLeft: sidebarOpen ? '16rem' : '5rem',
//             transition: 'margin-left 0.3s ease',
//           }}
//         >
//           <div className="text-center py-12 bg-white rounded-xl shadow-md p-8">
//             <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
//             <p className="text-gray-600 font-medium text-lg tracking-wide">
//               Loading course details...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div
//           className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center"
//           style={{
//             marginLeft: sidebarOpen ? '16rem' : '5rem',
//             transition: 'margin-left 0.3s ease',
//           }}
//         >
//           <div className="bg-white rounded-xl shadow-2xl border border-red-100 p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
//             <div className="flex flex-col items-center">
//               <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
//                 <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800 mb-2">
//                 Course Not Found
//               </h2>
//               <p className="text-gray-600 mb-6">{error || 'The requested course could not be retrieved.'}</p>
//               <button
//                 onClick={handleBack}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <FiArrowLeft />
//                 <span>Back to Enrolled Courses</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const activeLessonData = lessons.find(lesson => lesson._id === activeLesson);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div
//         className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
//         style={{
//           marginLeft: sidebarOpen ? '16rem' : '5rem',
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <button
//               onClick={handleBack}
//               className="group flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:-translate-x-2 font-semibold"
//             >
//               <FiArrowLeft className="h-5 w-5 transition-transform" />
//               <span className="tracking-wide">Back to Enrolled Courses</span>
//             </button>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
//             <div className="grid md:grid-cols-3 gap-0">
//               <div className="md:col-span-1 relative overflow-hidden">
//                 <div className="relative h-64 md:h-full group">
//                   <img
//                     src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
//                     alt={course.title}
//                     className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute top-4 right-4 flex space-x-2">
//                     {course.price === 0 && (
//                       <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                         FREE
//                       </span>
//                     )}
//                     <span className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-md
//                       ${course.completionStatus === 'completed' ? 'bg-green-500' : 
//                         course.completionStatus === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}
//                     >
//                       {course.completionStatus === 'completed' ? 'Completed' : 
//                         course.completionStatus === 'in-progress' ? 'In Progress' : 'Enrolled'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="md:col-span-2 p-8 bg-white">
//                 <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
//                   {course.title}
//                 </h1>
//                 <p className="text-gray-600 leading-relaxed mb-6 text-base opacity-90">
//                   {course.description}
//                 </p>
                
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                   {[
//                     { label: 'Price', value: course.price === 0 ? 'FREE' : `₹${course.price}` },
//                     { icon: FiBookOpen, label: 'Lessons', value: lessons.length },
//                     { icon: FiGlobe, label: 'Language', value: course.language },
//                     { icon: FiTag, label: 'Category', value: course.category?.categoryName || 'Uncategorized' }
//                   ].map(({ icon: Icon, label, value }, index) => (
//                     <div key={label} className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors">
//                       <div className="flex items-center mb-1">
//                         {Icon && <Icon className="h-5 w-5 text-blue-600 mr-2" />}
//                         <span className="text-xs text-gray-500 font-medium">{label}</span>
//                       </div>
//                       <p className="text-gray-800 font-bold text-sm">{value}</p>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="flex items-center space-x-6 mb-4">
//                   <div className="flex items-center">
//                     <FiUser className="h-5 w-5 text-blue-600 mr-2" />
//                     <span className="text-gray-700 font-semibold">
//                       {course.instructor?.name || 'Unknown Instructor'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-500">
//                   Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1 order-2 lg:order-1">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                   <h2 className="text-lg font-bold text-gray-800 flex items-center">
//                     <FiBookOpen className="mr-2 text-blue-600" />
//                     Course Content
//                   </h2>
//                   <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons</p>
//                 </div>
                
//                 {lessons.length === 0 ? (
//                   <div className="p-6 text-center">
//                     <p className="text-gray-500">No lessons available for this course.</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
//                     {lessons.map((lesson, index) => (
//                       <button
//                         key={lesson._id}
//                         onClick={() => setActiveLesson(lesson._id)}
//                         className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
//                           activeLesson === lesson._id ? 'bg-blue-50 border-l-4 border-blue-600 pl-2' : ''
//                         }`}
//                       >
//                         <div className="flex items-start">
//                           <div className="flex-shrink-0 bg-blue-100 text-blue-600 font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className={`font-semibold text-sm ${activeLesson === lesson._id ? 'text-blue-600' : 'text-gray-800'}`}>
//                               {lesson.title}
//                             </h3>
//                             <p className="text-gray-500 text-xs mt-1 truncate">{lesson.description}</p>
//                             {lesson.duration && (
//                               <div className="flex items-center text-gray-400 text-xs mt-1">
//                                 <FiClock className="h-3 w-3 mr-1" />
//                                 <span>{lesson.duration}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="lg:col-span-2 order-1 lg:order-2">
//               {activeLessonData ? (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="aspect-w-16 aspect-h-9 bg-gray-900">
//                     {activeLessonData.video ? (
//                       <video
//                         key={activeLessonData.video}
//                         controls
//                         className="w-full h-full object-contain"
//                         onError={() => handleVideoError(activeLessonData._id)}
//                         onEnded={() => updateLessonProgress(activeLessonData._id)}
//                       >
//                         <source src={activeLessonData.video} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     ) : (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-center p-8">
//                           <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                           <p className="text-gray-300 text-lg font-medium">No video available for this lesson</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-5">
//                     <div className="flex items-center mb-2">
//                       <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
//                         Lesson {activeLessonData.lessonNumber}
//                       </span>
//                       {activeLessonData.duration && (
//                         <div className="flex items-center text-gray-500 text-xs">
//                           <FiClock className="h-3 w-3 mr-1" />
//                           <span>{activeLessonData.duration}</span>
//                         </div>
//                       )}
//                     </div>
//                     <h2 className="text-xl font-bold text-gray-800 mb-3">
//                       {activeLessonData.title}
//                     </h2>
//                     <div className="prose max-w-none">
//                       <p className="text-gray-600">{activeLessonData.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//                   <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
//                   <p className="text-gray-500">
//                     {lessons.length > 0 
//                       ? "Select a lesson from the sidebar to view its content" 
//                       : "This course doesn't have any lessons yet"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentEnrolledCourseDetails;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   FiArrowLeft, FiBookOpen, FiClock, FiPlayCircle, 
//   FiGlobe, FiTag, FiUser, FiCheckCircle 
// } from 'react-icons/fi';
// import StudentSidebar from '../../../common/StudentSidebar';
// import { api } from '../../../config/api';
// import toast from 'react-hot-toast';

// interface Lesson {
//   _id: string;
//   lessonNumber: number;
//   title: string;
//   description: string;
//   video: string;
//   duration?: string;
//   course: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail?: string;
//   category: { _id: string; categoryName: string; isActive: boolean };
//   price: number;
//   language: string;
//   duration?: string;
//   lessons: string[]; 
//   rating?: number;
//   isPublished: boolean;
//   instructor: { _id: string; name: string };
//   isBlocked: boolean;
//   progress?: number; // Added for student progress tracking
//   completedLessons?: string[]; // Added to track which lessons student has completed
// }

// const StudentEnrolledCourseDetails: React.FC = () => {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [course, setCourse] = useState<Course | null>(null);
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRefreshingThumbnail, setIsRefreshingThumbnail] = useState<boolean>(false);
//   const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());
//   const [activeLesson, setActiveLesson] = useState<string | null>(null);
//   const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

//   const fetchEnrolledCourseDetails = async () => {
//     if (!courseId) {
//       setError('Course ID is missing');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       // Get the student's enrolled course details
//       const courseResponse = await api.get(`/users/enrolled-course-details/${courseId}`, {
//         withCredentials: true,
//       });

//       if (courseResponse.status !== 200) {
//         throw new Error(courseResponse.data.message || 'Failed to fetch course details');
//       }

//       const courseData = courseResponse.data.course;
      
//       // Set completed lessons if available from the response
//       if (courseData.completedLessons) {
//         setCompletedLessons(new Set(courseData.completedLessons));
//       }

//       if (courseData.lessons && courseData.lessons.length > 0) {
//         // Get all lessons for this course
//         const lessonsResponse = await api.get(`/users/enrolled-course-lessons/${courseId}`, {
//           withCredentials: true,
//         });

//         if (lessonsResponse.status !== 200) {
//           throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
//         }

//         const sortedLessons = (lessonsResponse.data.lessons || []).sort((a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber);
//         setLessons(sortedLessons);
        
//         if (sortedLessons.length > 0) {
//           setActiveLesson(sortedLessons[0]._id);
//         }
//       } else {
//         setLessons([]);
//       }

//       setCourse(courseData);
//     } catch (err: any) {
//       console.error('Error fetching course details:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEnrolledCourseDetails();
//   }, [courseId]);

//   const handleThumbnailError = async () => {
//     if (!isRefreshingThumbnail && course && course.thumbnail) {
//       setIsRefreshingThumbnail(true);
//       try {
//         const fileName = course.thumbnail.split('/').pop();
//         if (!fileName) {
//           console.error('Could not extract filename from thumbnail URL:', course.thumbnail);
//           return;
//         }

//         const { data } = await api.post('/users/get-s3-url', {
//           fileName: fileName,
//           fileType: 'image/*',
//           getUrl: true,
//         });

//         setCourse((prev) => (prev ? { ...prev, thumbnail: data.downloadUrl } : prev));
//       } catch (error) {
//         console.error('Error refreshing thumbnail URL:', error);
//         toast.error('Failed to refresh thumbnail');
//       } finally {
//         setIsRefreshingThumbnail(false);
//       }
//     }
//   };

//   const handleVideoError = async (lessonId: string) => {
//     if (!refreshingVideos.has(lessonId)) {
//       setRefreshingVideos((prev) => new Set(prev).add(lessonId));
//       try {
//         const lesson = lessons.find((l) => l._id === lessonId);
//         if (!lesson || !lesson.video) return;

//         const fileName = lesson.video.split('/').pop();
//         if (!fileName) {
//           console.error('Could not extract filename from video URL:', lesson.video);
//           return;
//         }

//         const { data } = await api.post('/users/get-s3-url', {
//           fileName: fileName,
//           fileType: 'video/*',
//           getUrl: true,
//         });

//         setLessons((prev) =>
//           prev.map((l) =>
//             l._id === lessonId ? { ...l, video: data.downloadUrl } : l
//           )
//         );
//       } catch (error) {
//         console.error('Error refreshing video URL:', error);
//         toast.error('Failed to refresh video');
//       } finally {
//         setRefreshingVideos((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(lessonId);
//           return newSet;
//         });
//       }
//     }
//   };

// //   const markLessonComplete = async (lessonId: string) => {
// //     try {
// //       const response = await api.post('/students/mark-lesson-complete', {
// //         lessonId,
// //         courseId
// //       }, {
// //         withCredentials: true
// //       });

// //       if (response.status === 200) {
// //         setCompletedLessons(prev => new Set([...prev, lessonId]));
// //         toast.success('Lesson marked as completed!');
        
// //         // Update course progress
// //         setCourse(prev => {
// //           if (!prev) return null;
          
// //           const totalLessons = lessons.length;
// //           const completedCount = new Set([...completedLessons, lessonId]).size;
// //           const newProgress = Math.round((completedCount / totalLessons) * 100);
          
// //           return {
// //             ...prev,
// //             progress: newProgress
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error marking lesson as complete:', error);
// //       toast.error('Failed to mark lesson as complete');
// //     }
// //   };

//   const handleBack = () => {
//     navigate('/my-courses');
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div
//           className="flex-1 min-w-0 flex items-center justify-center"
//           style={{
//             marginLeft: sidebarOpen ? '16rem' : '5rem',
//             transition: 'margin-left 0.3s ease',
//           }}
//         >
//           <div className="text-center py-12 bg-white rounded-xl shadow-md p-8">
//             <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
//             <p className="text-gray-600 font-medium text-lg tracking-wide">
//               Loading course details...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div
//           className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center"
//           style={{
//             marginLeft: sidebarOpen ? '16rem' : '5rem',
//             transition: 'margin-left 0.3s ease',
//           }}
//         >
//           <div className="bg-white rounded-xl shadow-2xl border border-red-100 p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
//             <div className="flex flex-col items-center">
//               <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
//                 <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800 mb-2">
//                 Course Not Found
//               </h2>
//               <p className="text-gray-600 mb-6">{error || 'The requested course could not be retrieved or you are not enrolled in this course.'}</p>
//               <button
//                 onClick={handleBack}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <FiArrowLeft />
//                 <span>Back to My Courses</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const activeLessonData = lessons.find(lesson => lesson._id === activeLesson);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div
//         className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
//         style={{
//           marginLeft: sidebarOpen ? '16rem' : '5rem',
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <button
//               onClick={handleBack}
//               className="group flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:-translate-x-2 font-semibold"
//             >
//               <FiArrowLeft className="h-5 w-5 transition-transform" />
//               <span className="tracking-wide">Back to My Courses</span>
//             </button>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
//             <div className="grid md:grid-cols-3 gap-0">
//               <div className="md:col-span-1 relative overflow-hidden">
//                 <div className="relative h-64 md:h-full group">
//                   <img
//                     src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
//                     alt={course.title}
//                     className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
//                     onError={handleThumbnailError}
//                   />
//                   {course.price === 0 && (
//                     <div className="absolute top-4 right-4">
//                       <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                         FREE
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="md:col-span-2 p-8 bg-white">
//                 <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
//                   {course.title}
//                 </h1>
//                 <p className="text-gray-600 leading-relaxed mb-6 text-base opacity-90">
//                   {course.description}
//                 </p>
                
//                 {course.progress !== undefined && (
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium text-gray-700 mb-2">Your Progress</h3>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div 
//                         className="bg-blue-600 h-2.5 rounded-full" 
//                         style={{ width: `${course.progress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-gray-500 text-xs mt-1">{course.progress}% completed</p>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                   {[
//                     { icon: FiBookOpen, label: 'Lessons', value: lessons.length },
//                     { icon: FiGlobe, label: 'Language', value: course.language },
//                     { icon: FiTag, label: 'Category', value: course.category?.categoryName || 'Uncategorized' },
//                     { icon: FiUser, label: 'Instructor', value: course.instructor?.name || 'Unknown Instructor' }
//                   ].map(({ icon: Icon, label, value }) => (
//                     <div key={label} className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors">
//                       <div className="flex items-center mb-1">
//                         {Icon && <Icon className="h-5 w-5 text-blue-600 mr-2" />}
//                         <span className="text-xs text-gray-500 font-medium">{label}</span>
//                       </div>
//                       <p className="text-gray-800 font-bold text-sm">{value}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1 order-2 lg:order-1">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                   <h2 className="text-lg font-bold text-gray-800 flex items-center">
//                     <FiBookOpen className="mr-2 text-blue-600" />
//                     Course Content
//                   </h2>
//                   <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons</p>
//                 </div>
                
//                 {lessons.length === 0 ? (
//                   <div className="p-6 text-center">
//                     <p className="text-gray-500">No lessons available for this course.</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
//                     {lessons.map((lesson, index) => (
//                       <button
//                         key={lesson._id}
//                         onClick={() => setActiveLesson(lesson._id)}
//                         className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
//                           activeLesson === lesson._id ? 'bg-blue-50 border-l-4 border-blue-600 pl-2' : ''
//                         }`}
//                       >
//                         <div className="flex items-start">
//                           <div className={`flex-shrink-0 ${
//                             completedLessons.has(lesson._id) 
//                               ? 'bg-green-100 text-green-600' 
//                               : 'bg-blue-100 text-blue-600'
//                           } font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs`}>
//                             {completedLessons.has(lesson._id) ? <FiCheckCircle /> : index + 1}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className={`font-semibold text-sm ${
//                               activeLesson === lesson._id 
//                                 ? 'text-blue-600' 
//                                 : completedLessons.has(lesson._id) 
//                                   ? 'text-green-600' 
//                                   : 'text-gray-800'
//                             }`}>
//                               {lesson.title}
//                             </h3>
//                             <p className="text-gray-500 text-xs mt-1 truncate">{lesson.description}</p>
//                             {lesson.duration && (
//                               <div className="flex items-center text-gray-400 text-xs mt-1">
//                                 <FiClock className="h-3 w-3 mr-1" />
//                                 <span>{lesson.duration}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="lg:col-span-2 order-1 lg:order-2">
//               {activeLessonData ? (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="aspect-w-16 aspect-h-9 bg-gray-900">
//                     {activeLessonData.video ? (
//                       <video
//                         key={activeLessonData.video}
//                         controls
//                         className="w-full h-full object-contain"
//                         onError={() => handleVideoError(activeLessonData._id)}
//                       >
//                         <source src={activeLessonData.video} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     ) : (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-center p-8">
//                           <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                           <p className="text-gray-300 text-lg font-medium">No video available for this lesson</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-5">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
//                           Lesson {activeLessonData.lessonNumber}
//                         </span>
//                         {activeLessonData.duration && (
//                           <div className="flex items-center text-gray-500 text-xs">
//                             <FiClock className="h-3 w-3 mr-1" />
//                             <span>{activeLessonData.duration}</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Mark as complete button */}
//                       {completedLessons.has(activeLessonData._id) ? (
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           <FiCheckCircle className="mr-1" /> Completed
//                         </span>
//                       ) : (
//                         <button
//                         //   onClick={() => }
//                           className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                           Mark as Complete
//                         </button>
//                       )}
//                     </div>
                    
//                     <h2 className="text-xl font-bold text-gray-800 mb-3">
//                       {activeLessonData.title}
//                     </h2>
//                     <div className="prose max-w-none">
//                       <p className="text-gray-600">{activeLessonData.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//                   <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
//                   <p className="text-gray-500">
//                     {lessons.length > 0 
//                       ? "Select a lesson from the sidebar to view its content" 
//                       : "This course doesn't have any lessons yet"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentEnrolledCourseDetails;







// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   FiBookOpen, FiClock, FiDollarSign, FiGlobe, 
//   FiUser, FiTag, FiChevronLeft, FiPlayCircle 
// } from 'react-icons/fi';
// import StudentSidebar from '../../../common/StudentSidebar';
// import { api } from '../../../config/api';
// import toast from 'react-hot-toast';

// interface Lesson {
//   _id: string;
//   lessonNumber: number;
//   title: string;
//   description?: string;
//   duration?: string;
//   video?: string;
//   course: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail?: string;
//   category: { _id: string; categoryName: string; isActive: boolean };
//   price: number;
//   language: string;
//   duration?: string;
//   lessons: string[];
//   rating?: number;
//   isPublished: boolean;
//   instructor: { _id: string; name: string };
//   isBlocked: boolean;
// }

// const StudentEnrolledCourseDetails: React.FC = () => {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [course, setCourse] = useState<Course | null>(null);
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeLesson, setActiveLesson] = useState<string | null>(null);
//   const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());

//   const fetchCourseDetails = async () => {
//     if (!courseId) {
//       setError('Course ID is missing');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const courseResponse = await api.get(`/users/enrolled-course-details/${courseId}`, {
//         withCredentials: true,
//       });

//       if (courseResponse.status !== 200) {
//         throw new Error(courseResponse.data.message || 'Failed to fetch course details');
//       }

//       const courseData = courseResponse.data.course;

//       if (courseData.lessons && courseData.lessons.length > 0) {
//         const lessonsResponse = await api.get(`/users/enrolled-course-lessons/${courseId}`, {
//           withCredentials: true,
//         });

//         if (lessonsResponse.status !== 200) {
//           throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
//         }

//         const sortedLessons = (lessonsResponse.data.lessons || []).sort(
//           (a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber
//         );
//         setLessons(sortedLessons);
//         if (sortedLessons.length > 0) {
//           setActiveLesson(sortedLessons[0]._id);
//         }
//       } else {
//         setLessons([]);
//       }

//       setCourse(courseData);
//     } catch (err: any) {
//       console.error('Error fetching course details:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVideoError = async (lessonId: string) => {
//     if (!refreshingVideos.has(lessonId)) {
//       setRefreshingVideos((prev) => new Set(prev).add(lessonId));
//       try {
//         const lesson = lessons.find((l) => l._id === lessonId);
//         if (!lesson || !lesson.video) return;

//         const fileName = lesson.video.split('/').pop();
//         if (!fileName) {
//           console.error('Could not extract filename from video URL:', lesson.video);
//           return;
//         }

//         const { data } = await api.post('/users/get-s3-url', {
//           fileName: fileName,
//           fileType: 'video/*',
//           getUrl: true,
//         });

//         setLessons((prev) =>
//           prev.map((l) =>
//             l._id === lessonId ? { ...l, video: data.downloadUrl } : l
//           )
//         );
//       } catch (error) {
//         console.error('Error refreshing video URL:', error);
//         toast.error('Failed to refresh video');
//       } finally {
//         setRefreshingVideos((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(lessonId);
//           return newSet;
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     fetchCourseDetails();
//   }, [courseId]);

//   const handleBackToEnrolledCourses = () => {
//     navigate('/enrolled-courses');
    
//   };

//   const activeLessonData = lessons.find((lesson) => lesson._id === activeLesson);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
//       <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div
//         className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
//         style={{
//           marginLeft: sidebarOpen ? '16rem' : '5rem',
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button 
//                   onClick={handleBackToEnrolledCourses} 
//                   className="text-gray-600 hover:text-blue-900 transition-colors"
//                 >
//                   <FiChevronLeft className="h-6 w-6" />
//                 </button>
//                 <h1 className="text-3xl font-bold text-blue-900">Enrolled Course Details</h1>
//               </div>
//               <button
//                 onClick={handleBackToEnrolledCourses}
//                 className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
//               >
//                 Back to Enrolled Courses
//               </button>
//             </div>
//             <p className="text-gray-500 mt-2">Detailed insights into your enrolled course</p>
//           </div>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center min-h-[500px]">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
//               <p className="text-gray-600 text-lg">Loading course details...</p>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-red-800 font-semibold">{error}</p>
//               </div>
//             </div>
//           ) : !course ? (
//             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center max-w-md mx-auto">
//               <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//                 <FiBookOpen className="h-12 w-12 text-blue-900" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h3>
//               <p className="text-gray-600 mb-6">The course you are looking for might have been removed or is currently unavailable.</p>
//             </div>
//           ) : (
//             <>
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
//                 <div className="grid md:grid-cols-3 gap-0">
//                   <div className="md:col-span-1 relative overflow-hidden">
//                     <img
//                       src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
//                       alt={course.title}
//                       className="w-full h-64 md:h-full object-cover"
//                       onError={(e) => {
//                         console.error(`Failed to load image: ${course.thumbnail}`);
//                         e.currentTarget.src = 'https://via.placeholder.com/500x300?text=No+Thumbnail';
//                       }}
//                     />
//                   </div>
//                   <div className="md:col-span-2 p-8 bg-white">
//                     <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
//                     <p className="text-gray-600 mb-6">{course.description}</p>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1">
//                           <FiDollarSign className="h-5 w-5 text-blue-600 mr-2" />
//                           <span className="text-xs text-gray-500">Price</span>
//                         </div>
//                         <p className="text-gray-800 font-bold text-sm">
//                           {course.price === 0 ? 'FREE' : `₹${course.price}`}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1">
//                           <FiBookOpen className="h-5 w-5 text-blue-600 mr-2" />
//                           <span className="text-xs text-gray-500">Lessons</span>
//                         </div>
//                         <p className="text-gray-800 font-bold text-sm">{lessons.length}</p>
//                       </div>
//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1">
//                           <FiGlobe className="h-5 w-5 text-blue-600 mr-2" />
//                           <span className="text-xs text-gray-500">Language</span>
//                         </div>
//                         <p className="text-gray-800 font-bold text-sm">{course.language}</p>
//                       </div>
//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1">
//                           <FiTag className="h-5 w-5 text-blue-600 mr-2" />
//                           <span className="text-xs text-gray-500">Category</span>
//                         </div>
//                         <p className="text-gray-800 font-bold text-sm">
//                           {course.category?.categoryName || 'Uncategorized'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <FiUser className="h-5 w-5 text-blue-600 mr-2" />
//                       <span className="text-gray-700 font-semibold">
//                         {course.instructor?.name || 'Unknown'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-1 order-2 lg:order-1">
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
//                     <div className="p-4 border-b border-gray-200 bg-gray-50">
//                       <h2 className="text-lg font-bold text-gray-800 flex items-center">
//                         <FiBookOpen className="mr-2 text-blue-600" />
//                         Course Content
//                       </h2>
//                       <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons</p>
//                     </div>
//                     {lessons.length === 0 ? (
//                       <div className="p-6 text-center">
//                         <p className="text-gray-500">No lessons available for this course.</p>
//                       </div>
//                     ) : (
//                       <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
//                         {lessons.map((lesson, index) => (
//                           <button
//                             key={lesson._id}
//                             onClick={() => setActiveLesson(lesson._id)}
//                             className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
//                               activeLesson === lesson._id ? 'bg-blue-50 border-l-4 border-blue-600 pl-2' : ''
//                             }`}
//                           >
//                             <div className="flex items-start">
//                               <div className="flex-shrink-0 bg-blue-100 text-blue-600 font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs">
//                                 {index + 1}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <h3 className={`font-semibold text-sm ${activeLesson === lesson._id ? 'text-blue-600' : 'text-gray-800'}`}>
//                                   {lesson.title}
//                                 </h3>
//                                 <p className="text-gray-500 text-xs mt-1 truncate">{lesson.description}</p>
//                                 {lesson.duration && (
//                                   <div className="flex items-center text-gray-400 text-xs mt-1">
//                                     <FiClock className="h-3 w-3 mr-1" />
//                                     <span>{lesson.duration}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="lg:col-span-2 order-1 lg:order-2">
//                   {activeLessonData ? (
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                       <div className="aspect-w-16 aspect-h-9 bg-gray-900">
//                         {activeLessonData.video ? (
//                           <video
//                             key={activeLessonData.video}
//                             controls
//                             className="w-full h-full object-contain"
//                             onError={() => handleVideoError(activeLessonData._id)}
//                           >
//                             <source src={activeLessonData.video} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                         ) : (
//                           <div className="flex items-center justify-center h-full">
//                             <div className="text-center p-8">
//                               <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                               <p className="text-gray-300 text-lg font-medium">No video available for this lesson</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-5">
//                         <div className="flex items-center mb-2">
//                           <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
//                             Lesson {activeLessonData.lessonNumber}
//                           </span>
//                           {activeLessonData.duration && (
//                             <div className="flex items-center text-gray-500 text-xs">
//                               <FiClock className="h-3 w-3 mr-1" />
//                               <span>{activeLessonData.duration}</span>
//                             </div>
//                           )}
//                         </div>
//                         <h2 className="text-xl font-bold text-gray-800 mb-3">{activeLessonData.title}</h2>
//                         <p className="text-gray-600">{activeLessonData.description}</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//                       <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
//                       <p className="text-gray-500">
//                         {lessons.length > 0
//                           ? 'Select a lesson from the sidebar to view its content'
//                           : 'This course doesn’t have any lessons yet'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentEnrolledCourseDetails;



import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiBookOpen, FiClock, FiDollarSign, FiGlobe, 
  FiUser, FiTag, FiChevronLeft, FiPlayCircle, FiCheckCircle 
} from 'react-icons/fi';
import StudentSidebar from '../../../common/StudentSidebar';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface Lesson {
  _id: string;
  lessonNumber: number;
  title: string;
  description?: string;
  duration?: string;
  video?: string;
  course: string;
}

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

interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
  progress: {
    completedLessons: string[];
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentEnrolledCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [refreshingVideos, setRefreshingVideos] = useState<Set<string>>(new Set());
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [courseCompletionPercentage, setCourseCompletionPercentage] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fetchCourseDetails = async () => {
    if (!courseId) {
      setError('Course ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const courseResponse = await api.get(`/users/enrolled-course-details/${courseId}`, {
        withCredentials: true,
      });

      if (courseResponse.status !== 200) {
        throw new Error(courseResponse.data.message || 'Failed to fetch course details');
      }

      const courseData = courseResponse.data.course;

      if (courseData.lessons && courseData.lessons.length > 0) {
        const lessonsResponse = await api.get(`/users/enrolled-course-lessons/${courseId}`, {
          withCredentials: true,
        });

        if (lessonsResponse.status !== 200) {
          throw new Error(lessonsResponse.data.message || 'Failed to fetch lessons');
        }

        const sortedLessons = (lessonsResponse.data.lessons || []).sort(
          (a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber
        );
        setLessons(sortedLessons);
        if (sortedLessons.length > 0) {
          setActiveLesson(sortedLessons[0]._id);
        }
      } else {
        setLessons([]);
      }

      // Fetch enrollment data to get progress
      const enrollmentResponse = await api.get(`/users/enrolled-course-detailss/${courseId}`, {
        withCredentials: true,
      });
      const enrollmentData = enrollmentResponse.data.enrollment || {
        progress: { completedLessons: [], overallCompletionPercentage: 0 },
      };
      setEnrollment(enrollmentData);
      setCourseCompletionPercentage(enrollmentData.progress.overallCompletionPercentage || 0);

      setCourse(courseData);
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoError = async (lessonId: string) => {
    if (!refreshingVideos.has(lessonId)) {
      setRefreshingVideos((prev) => new Set(prev).add(lessonId));
      try {
        const lesson = lessons.find((l) => l._id === lessonId);
        if (!lesson || !lesson.video) return;

        const fileName = lesson.video.split('/').pop();
        if (!fileName) {
          console.error('Could not extract filename from video URL:', lesson.video);
          return;
        }

        const { data } = await api.post('/users/get-s3-url', {
          fileName: fileName,
          fileType: 'video/*',
          getUrl: true,
        });

        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, video: data.downloadUrl } : l
          )
        );
      } catch (error) {
        console.error('Error refreshing video URL:', error);
        toast.error('Failed to refresh video');
      } finally {
        setRefreshingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleBackToEnrolledCourses = () => {
    navigate('/enrolled-courses');
  };

  const handleVideoProgress = () => {
    if (videoRef.current && lessons.length > 0 && activeLesson) {
      const { currentTime, duration } = videoRef.current;
      const percentageWatched = (currentTime / duration) * 100;

      if (percentageWatched >= 80 && !enrollment?.progress.completedLessons.includes(activeLesson)) {
        updateLessonCompletion(activeLesson);
      }
    }
  };

  const updateLessonCompletion = async (lessonId: string) => {
    try {
      const response = await api.post('/users/update-lesson-progress', {
        courseId,
        lessonId,
        status: 'completed',
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const updatedEnrollment = response.data.enrollment;
        setEnrollment(updatedEnrollment);
        setCourseCompletionPercentage(updatedEnrollment.progress.overallCompletionPercentage);
        toast.success('Lesson marked as completed!');
      }
    } catch (error) {
      console.error('Failed to update lesson progress:', error);
      toast.error('Failed to mark lesson as complete');
    }
  };

  const activeLessonData = lessons.find((lesson) => lesson._id === activeLesson);

 

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleBackToEnrolledCourses} 
                  className="text-gray-600 hover:text-blue-900 transition-colors"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold text-blue-900">Enrolled Course Details</h1>
              </div>
              <button
                onClick={handleBackToEnrolledCourses}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                Back to Enrolled Courses
              </button>
            </div>
            <p className="text-gray-500 mt-2">Detailed insights into your enrolled course</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading course details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          ) : !course ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center max-w-md mx-auto">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="h-12 w-12 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h3>
              <p className="text-gray-600 mb-6">The course you are looking for might have been removed or is currently unavailable.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="md:col-span-1 relative overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Thumbnail'}
                      alt={course.title}
                      className="w-full h-64 md:h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${course.thumbnail}`);
                        e.currentTarget.src = 'https://via.placeholder.com/500x300?text=No+Thumbnail';
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 p-8 bg-white">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>
                    {enrollment && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Your Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${courseCompletionPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{courseCompletionPercentage}% completed</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiDollarSign className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Price</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">
                          {course.price === 0 ? 'FREE' : `₹${course.price}`}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiBookOpen className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Lessons</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">{lessons.length}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiGlobe className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Language</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">{course.language}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FiTag className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-xs text-gray-500">Category</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">
                          {course.category?.categoryName || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        {course.instructor?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <FiBookOpen className="mr-2 text-blue-600" />
                        Course Content
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons</p>
                    </div>
                    {lessons.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No lessons available for this course.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                        {lessons.map((lesson, index) => (
                          <button
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson._id)}
                            className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                              activeLesson === lesson._id ? 'bg-blue-50 border-l-4 border-blue-600 pl-2' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 ${
                                enrollment?.progress.completedLessons.includes(lesson._id)
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600'
                              } font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2 text-xs`}>
                                {enrollment?.progress.completedLessons.includes(lesson._id) ? <FiCheckCircle /> : index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-sm ${
                                  activeLesson === lesson._id
                                    ? 'text-blue-600'
                                    : enrollment?.progress.completedLessons.includes(lesson._id)
                                    ? 'text-green-600'
                                    : 'text-gray-800'
                                }`}>
                                  {lesson.title}
                                </h3>
                                <p className="text-gray-500 text-xs mt-1 truncate">{lesson.description}</p>
                                {lesson.duration && (
                                  <div className="flex items-center text-gray-400 text-xs mt-1">
                                    <FiClock className="h-3 w-3 mr-1" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 order-1 lg:order-2">
                  {activeLessonData ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                        {activeLessonData.video ? (
                          <video
                            ref={videoRef}
                            key={activeLessonData.video}
                            controls
                            className="w-full h-full object-contain"
                            onError={() => handleVideoError(activeLessonData._id)}
                            onTimeUpdate={handleVideoProgress}
                          >
                            <source src={activeLessonData.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8">
                              <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-300 text-lg font-medium">No video available for this lesson</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
                            Lesson {activeLessonData.lessonNumber}
                          </span>
                          {activeLessonData.duration && (
                            <div className="flex items-center text-gray-500 text-xs">
                              <FiClock className="h-3 w-3 mr-1" />
                              <span>{activeLessonData.duration}</span>
                            </div>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">{activeLessonData.title}</h2>
                        <p className="text-gray-600">{activeLessonData.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <FiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lesson Selected</h3>
                      <p className="text-gray-500">
                        {lessons.length > 0
                          ? 'Select a lesson from the sidebar to view its content'
                          : 'This course doesn’t have any lessons yet'}
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

export default StudentEnrolledCourseDetails;