import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.png"; // Assuming the same logo is used.

const UserLogin: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundColor: "#1E40AF", // Blue background
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="EduWorld Logo" className="h-12 w-20" />
          <h2 className="text-3xl font-extrabold text-blue-900 ml-3">
            Edu<span className="text-yellow-500">World</span>
          </h2>
        </div>

        {/* Login Form */}
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
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Log In
          </button>
        </form>
        

        <div className="mt-6 text-center">
          <button className="w-full bg-red-500 text-gray-900 py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Log In with Google
          </button>
        </div>

         {/* Forgot Password Link */}
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
