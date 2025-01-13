// import React from "react";


// import { FaBook } from "react-icons/fa";

// const Navbar: React.FC = () => {
//   return (
//     <nav className="bg-white text-gray-800 py-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center">
  
//         <h1 className="flex items-center text-4xl font-extrabold text-yellow-500 tracking-wide transform hover:scale-105 transition-all">
         
//           <FaBook className="mr-3 text-3xl" />
//           <span className="text-gray-500">Edu</span>
//           <span className="text-yellow-400">World</span>
//         </h1>

//         <ul className="flex space-x-6 text-lg font-medium">
//           <li><a href="#home" className="hover:text-yellow-400 transition-all">Home</a></li>
//           <li><a href="#features" className="hover:text-yellow-400 transition-all">Features</a></li>
//           <li><a href="#courses" className="hover:text-yellow-400 transition-all">Courses</a></li>
//           <li><a href="#testimonials" className="hover:text-yellow-400 transition-all">Testimonials</a></li>
//           <li><a href="#footer" className="hover:text-yellow-400 transition-all">Contact</a></li>
//         </ul>

//         <div className="flex space-x-4">
//           <button className="bg-yellow-400 text-white px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition-all">
//             Login
//           </button>
//           <button className="bg-gray-800 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-900 transition-all">
//             Signup
//           </button>
//         </div>

//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from "react";

// const Navbar: React.FC = () => {
//   return (
//     <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080')" }}>
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full px-8 lg:px-24">
//         {/* Text Section */}
//         <div className="text-center lg:text-left max-w-lg text-white">
//           <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
//             Start Learning and Embrace New Skills for a Better Future
//           </h1>
//           <p className="text-lg lg:text-xl mb-6">
//             With the help of E-Learning, create your own path and drive on your skills to achieve what you seek.
//           </p>
//           <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-400 transition">
//             View All Courses
//           </button>
//         </div>

//         {/* Image Section */}
//         <div className="mt-8 lg:mt-0">
//           <img
//             src="https://via.placeholder.com/500x500"
//             alt="E-learning Illustration"
//             className="w-full max-w-md mx-auto lg:mx-0"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;




import React from "react";
import logo from "../../../assets/home/logo.png";

const Navbar: React.FC = () => {
  return (
    <div className="bg-white shadow-md">
      {/* Navbar section */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold text-blue-900 flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-16"
          />
          <span>EduWorld</span>
        </div>
        <ul className="flex space-x-6 text-sm font-semibold text-gray-700">
          <li className="hover:text-yellow-400 cursor-pointer">HOME</li>
          <li className="hover:text-yellow-400 cursor-pointer">PAGES</li>
          <li className="hover:text-yellow-400 cursor-pointer">COURSES</li>
          <li className="hover:text-yellow-400 cursor-pointer">EVENTS</li>
          <li className="hover:text-yellow-400 cursor-pointer">TEACHERS</li>
          <li className="hover:text-yellow-400 cursor-pointer">PRICING</li>
          <li className="hover:text-yellow-400 cursor-pointer">BLOG</li>
          <li className="hover:text-yellow-400 cursor-pointer">CONTACT</li>
        </ul>
        <div className="flex space-x-4">
          {/* Separate Login and Register Buttons */}
          <button className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500">
            Login
          </button>
          <button className="bg-gray-300 px-4 py-2 text-black font-semibold rounded hover:bg-gray-400">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

