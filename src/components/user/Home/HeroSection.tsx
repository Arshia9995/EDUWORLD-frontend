// import React from "react";

// const HeroSection: React.FC = () => {
//   return (
//     <section className="bg-gradient-to-r from-gray-600 to-gray-500 text-white py-24">
//       <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-8">
//         {/* Text Content */}
//         <div className="text-center lg:text-left lg:w-1/2">
//           <h2 className="text-4xl font-bold mb-4">Welcome to EduWorld</h2>
//           <p className="text-lg mb-6">
//             Your learning journey starts here! Explore courses, learn new skills, and achieve your goals.
//           </p>
//           <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-400">
//             Get Started
//           </button>
//         </div>

//         {/* Image */}
//         <div className="lg:w-1/2">
//           <img
//             src="https://via.placeholder.com/500x300"
//             alt="Learning platform illustration"
//             className="w-full h-auto rounded-lg shadow-lg"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React from 'react';
import banner from "../../../assets/home/banner.png"

const HeroSection: React.FC = () => {
  return (
    <div className="bg-navy-900 min-h-[500px] relative px-4 py-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90"></div>
      
      {/* Main content container */}
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left content */}
        <div className="text-white lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Start Learning and Embrace
            <br />
            New Skills For Better Future
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            With the help of E-Learning, create your own path and drive on your
            skills on your own to achieve what you seek.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-3 rounded-md transition-colors">
            View All Courses
          </button>
        </div>
        
        <div className="lg:w-1/2">
          <img
            src={banner}
            alt="Learning platform illustration"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      
     
      
    </div>
  );
};

export default HeroSection;
