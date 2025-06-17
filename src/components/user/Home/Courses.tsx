
// import React from 'react';
// import { Star, Heart, Users } from 'lucide-react';
// import course1 from "../../../assets/home/courses1.jpg";
// import course2 from "../../../assets/home/courses2.jpg";
// import course3 from "../../../assets/home/courses3.jpg";
// import user from "../../../assets/home/user1.jpg";

// interface CourseCardProps {
//   title: string;
//   description: string;
//   author: { name: string; image: string };
//   price: string;
//   rating: number;
//   students: number;
//   likes: number;
//   image: string;
// }

// const CourseCard: React.FC<CourseCardProps> = ({ title, description, author, price, rating, students, likes, image }) => (
//   <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
   
//     <img src={image} alt={title} className="w-full h-48 object-cover"/>
    
   
//     <div className="p-5">
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//       <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      
//       <div className="flex items-center mb-4">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
//           />
//         ))}
//       </div>
      
     
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center text-gray-600">
//             <Users className="w-4 h-4 mr-1" />
//             <span className="text-sm">{students}</span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <Heart className="w-4 h-4 mr-1" />
//             <span className="text-sm">{likes}</span>
//           </div>
//         </div>
//         <span className={`px-4 py-1 rounded-md ${price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
//           {price === 'Free' ? 'Free' : `$${price}`}
//         </span>
//       </div>
      
     
//       <div className="flex items-center mt-4 pt-4 border-t">
//         <img src={author.image} alt={author.name} className="w-10 h-10 rounded-full mr-3"/>
//         <span className="text-gray-700">{author.name}</span>
//       </div>
//     </div>
//   </div>
// );

// const Courses: React.FC = () => {
//   const courses = [
//     {
//       title: "Data Product Manager",
//       description: "Follow the step by step process to learn data and gain understandability of software-based products in depth.",
//       author: {
//         name: "Alia Noor",
//         image: user 
//       },
//       price: "Free",
//       rating: 4.5,
//       students: 31,
//       likes: 10,
//       image: course1 
//     },
//     {
//       title: "Learning SQL",
//       description: "Get a deep knowledge from the beginning and learn how to use essential databases through SQL.",
//       author: {
//         name: "Alia Noor",
//         image: user 
//       },
//       price: "25.00",
//       rating: 4.5,
//       students: 31,
//       likes: 10,
//       image: course2 
//     },
//     {
//       title: "Java Programming",
//       description: "Learn the fundamental programming concept of java. It will open the right doors for you as a developer.",
//       author: {
//         name: "Alia Noor",
//         image: user 
//       },
//       price: "Free",
//       rating: 4.5,
//       students: 31,
//       likes: 10,
//       image: course3 
//     }
//   ];

//   return (
//     <div className="py-16 px-4 max-w-7xl mx-auto">
    
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4">
//           Discover The Variety Of Courses Here
//         </h2>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Choose one appropriate course for you from over multifarious courses available on this platform.
//         </p>
//       </div>

    
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {courses.map((course, index) => (
//           <CourseCard key={index} {...course} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Courses;

import React, { useEffect, useState } from 'react';
import { Star, Heart, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

// Import images from src/assets/home/
import course1Image from '../../../assets/home/courses1.jpg';
import course2Image from '../../../assets/home/courses2.jpg';
import course3Image from '../../../assets/home/courses3.jpg';

interface CourseCardProps {
  title: string;
  description: string;
  author: { name: string; image: string };
  price: string | number;
  rating: number;
  students: number;
  likes: number;
  image: string;
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

const CourseCard: React.FC<CourseCardProps> = ({ title, description, author, price, rating, students, likes, image }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
    <img src={image} alt={title} className="w-full h-48 object-cover"/>
    <div className="p-5">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{students}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Heart className="w-4 h-4 mr-1" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
        <span className={`px-4 py-1 rounded-md ${price === 0 || price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {price === 0 || price === 'Free' ? 'Free' : `₹${price}`}
        </span>
      </div>
      <div className="flex items-center mt-4 pt-4 border-t">
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white text-lg font-semibold mr-3">
          {author.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-700">{author.name}</span>
      </div>
    </div>
  </div>
);

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default courses for display (blurred when not logged in)
  const defaultCourses = [
    {
      title: "Data Product Manager",
      description: "Follow the step by step process to learn data and gain understandability of software-based products in depth.",
      author: { name: "Alia Noor", image: '/path/to/user1.jpg' },
      price: "Free",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course1Image // Use imported image
    },
    {
      title: "Learning SQL",
      description: "Get a deep knowledge from the beginning and learn how to use essential databases through SQL.",
      author: { name: "Alia Noor", image: '/path/to/user1.jpg' },
      price: "25.00",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course2Image // Use imported image
    },
    {
      title: "Java Programming",
      description: "Learn the fundamental programming concept of java. It will open the right doors for you as a developer.",
      author: { name: "Alia Noor", image: '/path/to/user1.jpg' },
      price: "Free",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course3Image // Use imported image
    }
  ];

  // Fetch latest courses if user is logged in
  useEffect(() => {
    if (user) {
      const fetchLatestCourses = async () => {
        try {
          setLoading(true);
          const response = await api.get('/users/getallpublishedcourses', {
            withCredentials: true,
            params: {
              page: 1,
              limit: 3,
              sortBy: 'newest',
            },
          });

          if (response.status !== 200) {
            throw new Error(response.data.message || 'Failed to fetch courses');
          }

          setCourses(response.data.courses || []);
        } catch (err: any) {
          console.error('Error fetching latest courses:', err);
          const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchLatestCourses();
    }
  }, [user]);

  // Map API courses to CourseCard props format
  const mappedCourses = courses.map(course => ({
    title: course.title,
    description: course.description,
    author: {
      name: course.instructor?.name || "Unknown",
      image: '/path/to/user1.jpg' // Placeholder, since API doesn't provide author image
    },
    price: course.price,
    rating: course.rating || 4.5, // Fallback rating if not provided
    students: 31, // API doesn't provide this, using placeholder
    likes: 10, // API doesn't provide this, using placeholder
    image: course.thumbnail || course1Image // Use imported image as fallback
  }));

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover The Variety Of Courses Here
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose one appropriate course for you from over multifarious courses available on this platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {(user ? (mappedCourses.length > 0 ? mappedCourses : defaultCourses) : defaultCourses).map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}

        {!user && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
              <Lock className="w-12 h-12 text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-800">Please Login to Unlock</h3>
              <p className="text-gray-600 text-center">
                Login to unlock all personalized courses
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && user && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      )}

      {error && user && (
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
    </div>
  );
};

export default Courses;