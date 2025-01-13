// import React from "react";

// const Features: React.FC = () => {
//   return (
//     <section id="features" className="py-16 bg-gray-100">
//       <div className="container mx-auto text-center">
//         <h3 className="text-3xl font-semibold mb-8">Why Choose EduWorld?</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h4 className="font-semibold text-xl mb-4">High Quality Courses</h4>
//             <p>Learn from the best instructors in various fields, ranging from tech to business.</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h4 className="font-semibold text-xl mb-4">Flexible Learning</h4>
//             <p>Study at your own pace with our flexible online courses, available anytime, anywhere.</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h4 className="font-semibold text-xl mb-4">Certifications</h4>
//             <p>Earn certifications that boost your career and show off your new skills!</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Features;


import React from 'react';
import { BookOpen, GraduationCap, Globe, Users, Headphones, UserCheck } from 'lucide-react';

 const Features: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-navy-800" />,
      title: "Course Accessibility",
      description: "Select a suitable course from the vast area of other courses and access it anytime and from anywhere.",
      bgColor: "bg-gray-100"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: "Scholarship",
      description: "To encourage talent, we give up to 100% aid to those young learners who have the ability to do something.",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "Practical learning",
      description: "Interact yourself with the real-world while doing the real-world project and other things to master your skills.",
      bgColor: "bg-orange-50"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Expert Mentors",
      description: "Learn from industry experts who are passionate about teaching and helping you grow.",
      bgColor: "bg-green-50"
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Get round-the-clock support from our dedicated team to help you with any questions or concerns.",
      bgColor: "bg-purple-50"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-pink-600" />,
      title: "Lifetime Access",
      description: "Get lifetime access to course content and updates to continue learning at your own pace.",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduWorld</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Look into yourself, know you're ambitious and keep moving forward until you get something in
          return as your achievement.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-6 rounded-lg transition-all hover:shadow-lg">
            {/* Icon Container */}
            <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
