import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/home/logo.png";

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

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
            Admin<span className="text-yellow-500">Login</span>
          </h2>
        </div>

        <form className="space-y-5">
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
              placeholder="Enter admin email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="relative">
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
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center">
          {/* <Link
            to="/forgotpassword"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
