import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import logo from "../../assets/home/logo.png";
import { useFormik } from 'formik';
import { ValidationSchema } from "../../schemas/ValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import { userSignup } from "../../redux/actions/userActions";
import { AppDispatch, RootState } from "../../redux/store";
import OtpVerification from "./OtpVerification";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { IUserSignupData } from "../../interface/IUserSignup";






interface UserValues {
  name: string;
  email: string;
  role: "student" | "instructor";
}
interface TempData {
  name: string;
  email: string;
  password: string;
  otp?: string;
  role: "student" | "instructor";
}
const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student"
}
const temporaryData: TempData = {
  name: "",
  email: "",
  password: "",
  role: "student",
}

const UserSignup: React.FC = () => {
  const [isOTP, setIsOTP] = useState<boolean>(false)
  const [tempData, setTempData] = useState<TempData>(temporaryData)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [role, setRole] = useState<string>("student"); 
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const { loading, error } = useSelector((state: RootState) => state.user);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    onSubmit: async (values, action) => {
    
      const { confirmPassword, ...rest } = values;

      const signupData: IUserSignupData = {
        name: rest.name,
        email: rest.email,
        password: rest.password,
        role: rest.role as 'student' | 'instructor'  
      };
      try {
      const response = await dispatch(userSignup(signupData)).unwrap()
      console.log(response, 'response ----')
      if (response) {
        console.log(rest,"rest values")
        setTempData({
          name: rest.name,
          email: rest.email,
          password: rest.password,
          role: rest.role as 'student' | 'instructor',
        });

        setIsOTP(true); 
        toast.success("Signup successful! OTP sent.");
        action.resetForm(); 
        navigate("/otp", { state: { userData: {
          name: rest.name,
          email: rest.email,
          password: rest.password,
          role: rest.role as 'student' | 'instructor',
        } } });
          }
         } catch (err: any) {
            console.error("Signup Error:", err);
            toast.error(
              typeof err === "string"
                ? err
                : "Signup failed. Please try again."
            );
          }

      
    //   }else {
    //     toast.error("Signup failed. Please try again."); 
    // }
      
    }
    
  })
 

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950/90 to-blue-950/90 overflow-hidden"
      style={{
        backgroundColor: "#1E40AF", 
      }}
    >
     
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
      
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="EduWorld Logo" className="h-12 w-20" />
          <h2 className="text-3xl font-extrabold text-blue-900 ml-3">
            Edu<span className="text-yellow-500">World</span>
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
      

       
        <form onSubmit={handleSubmit}  className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
             {errors.name && touched.name && <p className="text-red-700">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name='email'
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-500"
              required
            />
             {errors.email && touched.email && <p className="text-red-700">{errors.email}</p>}
          
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
             <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
          </div>
          {errors.password && touched.password && <p className="text-red-700">{errors.password}</p>}
          

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
             type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
            <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-red-700">{errors.confirmPassword}</p>
          )}
          

         
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
             
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
           {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        
         
          

        <div className="mt-6 text-center">
          <button className="w-full bg-red-500 text-gray-900 py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Sign Up with Google
          </button>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;