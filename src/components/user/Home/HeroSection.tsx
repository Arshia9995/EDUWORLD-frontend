


import React from 'react';
import banner from "../../../assets/home/banner.png"

const HeroSection: React.FC = () => {
  return (
    <div className="bg-navy-900 min-h-[500px] relative px-4 py-16">
    
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90"></div>
      
    
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center justify-between gap-12">
        
        
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
