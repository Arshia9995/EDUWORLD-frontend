// import React from "react";

// const Footer: React.FC = () => {
//   return (
//     <footer id="footer" className="bg-gray-500 text-white py-6">
//       <div className="container mx-auto text-center">
//         <p>&copy; 2025 EduWorld. All Rights Reserved.</p>
//         <ul className="flex justify-center space-x-4 mt-4">
//           <li><a href="#home">Home</a></li>
//           <li><a href="#features">Features</a></li>
//           <li><a href="#courses">Courses</a></li>
//           <li><a href="#testimonials">Testimonials</a></li>
//         </ul>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { MapPin, Phone, Mail, FileText } from 'lucide-react';
import appStore from "../../../assets/home/app-store.png";
import playStore from "../../../assets/home/play-store.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950/90 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Us Section */}
          <div>
            <h3 className="text-[#FFB800] text-xl font-bold mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#FFB800]"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#FFB800] mr-3 mt-1 flex-shrink-0" />
                <p>Spring Store London Oxford Street, 012 United Kingdom</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#FFB800] mr-3 flex-shrink-0" />
                <p>+00 1234 456789</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#FFB800] mr-3 flex-shrink-0" />
                <p>info@example.com</p>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-[#FFB800] mr-3 flex-shrink-0" />
                <p>000 123 2294 089</p>
              </div>
            </div>
          </div>

          {/* Feature Links */}
          <div>
            <h3 className="text-[#FFB800] text-xl font-bold mb-6 relative">
              Feature Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#FFB800]"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Scholarship</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#FFB800] text-xl font-bold mb-6 relative">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#FFB800]"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Teachers</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FFB800] transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Download App Section */}
          <div>
            <h3 className="text-[#FFB800] text-xl font-bold mb-6 relative">
              Download App
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#FFB800]"></span>
            </h3>
            <div className="space-y-4">
              <img 
                src={playStore} 
                alt="Get it on Google Play" 
                className="h-12 cursor-pointer"
              />
              <img 
                src={appStore} 
                alt="Download on App Store" 
                className="h-12 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <button className="bg-[#3b5998] text-white py-3 px-4 rounded flex items-center justify-center hover:opacity-90 transition-opacity">
            FACEBOOK
          </button>
          <button className="bg-[#1DA1F2] text-white py-3 px-4 rounded flex items-center justify-center hover:opacity-90 transition-opacity">
            TWITTER
          </button>
          <button className="bg-[#0077b5] text-white py-3 px-4 rounded flex items-center justify-center hover:opacity-90 transition-opacity">
            LINKEDIN
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p>Copyright © 2020 <span className="text-[#FFB800]">E-learning</span>. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
