import React from "react";


const OtpVerification: React.FC = () => {
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
       

        {/* Page Description */}
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          OTP Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to your registered email address to continue.
        </p>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter your OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Verify OTP
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => alert("Resending OTP...")}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
