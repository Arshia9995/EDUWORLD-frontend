// import React from "react";


// const ForgotPassword: React.FC = () => {
//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundColor: "#1E40AF", 
//       }}
//     >
   
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

//       <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
       
        

    
//         <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
//           Forgot Password?
//         </h2>
//         <p className="text-center text-gray-600 mb-6">
//           Enter your registered email address to receive the OTP.
//         </p>

       
//         <form className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email address"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//           >
//             Send OTP
//           </button>
//         </form>

        
//         <p className="text-center text-gray-600 mt-4">
//           Remembered your password?{" "}
//           <a
//             href="/login"
//             className="text-blue-600 hover:underline"
//           >
//             Log In
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import React from "react";
import UserForgotPassword from "../../components/auth/UserForgotPassword";

const ForgotPassword:  React.FC = () => {  
    return (
        <div>
         <UserForgotPassword />
        </div>
    );
};

export default ForgotPassword;
