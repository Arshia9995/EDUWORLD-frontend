import React  from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import { FiEye,FiEyeOff } from "react-icons/fi";
import logo from "../../assets/home/logo.png"; 
import { useState } from "react";
import toast from "react-hot-toast";
import { ValidationSchemaLogin } from "../../schemas/ValidationSchema";
import { userLogin } from "../../redux/actions/userActions";
import { RootState, AppDispatch } from "../../redux/store";


interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const UserLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {loading, error } = useSelector((state: RootState) => state.user);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues,
    validationSchema: ValidationSchemaLogin,
    onSubmit: async (values) => {
      try {
        await dispatch(userLogin(values)).unwrap();
        toast.success("Login successful!");
        navigate("/");

      } catch (err: any) {
        console.error("Login Error:", err);
        toast.error(typeof err === "string" ? err : "Login failed. Please try again.")
      }
    },

  })
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundColor: "#1E40AF", 
      }}
    >
    
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
        
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="EduWorld Logo" className="h-12 w-20" />
          <h2 className="text-3xl font-extrabold text-blue-900 ml-3">
            Edu<span className="text-yellow-500">World</span>
          </h2>
        </div>

        {error && <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              name="email"
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              // required
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
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              // required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && touched.password && <p className="text-red-700">{errors.password}</p>}

           {/* </div> */}

          

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
             {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        

        <div className="mt-6 text-center">
          <button className="w-full bg-red-500 text-gray-900 py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Log In with Google
          </button>
        </div>

        
         <div className="mt-4 text-center">
          <Link
            to="/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
