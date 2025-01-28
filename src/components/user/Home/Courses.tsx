
import React from 'react';
import { Star, Heart, Users } from 'lucide-react';
import course1 from "../../../assets/home/courses1.jpg";
import course2 from "../../../assets/home/courses2.jpg";
import course3 from "../../../assets/home/courses3.jpg";
import user from "../../../assets/home/user1.jpg";

interface CourseCardProps {
  title: string;
  description: string;
  author: { name: string; image: string };
  price: string;
  rating: number;
  students: number;
  likes: number;
  image: string;
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
        <span className={`px-4 py-1 rounded-md ${price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {price === 'Free' ? 'Free' : `$${price}`}
        </span>
      </div>
      
     
      <div className="flex items-center mt-4 pt-4 border-t">
        <img src={author.image} alt={author.name} className="w-10 h-10 rounded-full mr-3"/>
        <span className="text-gray-700">{author.name}</span>
      </div>
    </div>
  </div>
);

const Courses: React.FC = () => {
  const courses = [
    {
      title: "Data Product Manager",
      description: "Follow the step by step process to learn data and gain understandability of software-based products in depth.",
      author: {
        name: "Alia Noor",
        image: user 
      },
      price: "Free",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course1 
    },
    {
      title: "Learning SQL",
      description: "Get a deep knowledge from the beginning and learn how to use essential databases through SQL.",
      author: {
        name: "Alia Noor",
        image: user 
      },
      price: "25.00",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course2 
    },
    {
      title: "Java Programming",
      description: "Learn the fundamental programming concept of java. It will open the right doors for you as a developer.",
      author: {
        name: "Alia Noor",
        image: user 
      },
      price: "Free",
      rating: 4.5,
      students: 31,
      likes: 10,
      image: course3 
    }
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
    
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover The Variety Of Courses Here
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose one appropriate course for you from over multifarious courses available on this platform.
        </p>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
