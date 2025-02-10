// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { baseUrl } from "../../config/constants";




// const UserResetPassword: React.FC = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const email = location.state?.email || "";

//     const validationSchema = Yup.object().shape({
//         newPassword: Yup.string()
//           .min(6, "Password must be at least 6 characters")
//           .required("New password is required"),
//         confirmPassword: Yup.string()
//           .oneOf([Yup.ref("newPassword")], "Passwords must match")
//           .required("Confirm password is required"),
//       });

//       const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
//         try {
//           const response = await axios.post(`${baseUrl}/users/resetpassword`, {
//             email,
//             password: { newPassword: values.newPassword, confirmPassword: values.confirmPassword },
//           });
    
//           if (response.status === 200 && response.data.success) {
//             toast.success("Password changed successfully!");
//             navigate("/login");
//           } else {
//             toast.error(response.data.message || "Password reset failed");
//           }
//         } catch (error: any) {
//           toast.error(error.response?.data?.message || "Something went wrong");
//         }
//       };
    

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
//           Reset Password
//         </h2>
//         <p className="text-center text-gray-600 mb-6">
//           Create a new password for your account.
//         </p>

//         <Formik
//           initialValues={{ newPassword: "", confirmPassword: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//             {({ isSubmitting }) => (
//          <Form className="space-y-5">
//           <div>
//             <label
//               htmlFor="newPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               New Password
//             </label>
//             <Field
//                   type="password"
//                   name="newPassword"
//                   placeholder="Enter your new password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
//                 />
//                   <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
           
//           </div>

//           <div>
//             <label
//               htmlFor="confirmPassword
//               className="block text-sm font-medium text-gray-700"
//             >
//               Confirm New Password
//             </label>
//             <Field
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Re-enter your new password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
//                 />
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             disabled={isSubmitting}
//           >
//            {isSubmitting ? "Resetting..." : "Reset Password"}
//           </button>
//        </Form>
//          )}
//         </Formik>

        
//         <p className="text-center text-gray-600 mt-4">
//           Remembered your password?{" "}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Log In
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserResetPassword;

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../config/constants"; // Ensure you have this constant defined

const UserResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || ""; // ✅ Get email from previous page

  // ✅ Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  // ✅ Handle Password Reset
  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    try {
      const response = await axios.post(`${baseUrl}/users/resetpassword`, {
        email,
        password: { newPassword: values.newPassword, confirmPassword: values.confirmPassword },
      });

      if (response.status === 200 && response.data.success) {
        toast.success("Password changed successfully!");
        navigate("/login"); // ✅ Navigate to Login page
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor: "#1E40AF" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">Create a new password for your account.</p>

        {/* ✅ Formik Form */}
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-gray-600 mt-4">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserResetPassword;



