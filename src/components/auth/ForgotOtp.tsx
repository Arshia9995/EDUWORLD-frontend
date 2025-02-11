import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../config/constants";
import { useEffect } from "react";




const ForgotOtp: React.FC = () => {

    const navigate = useNavigate();
    const locatiom = useLocation();

    const [email] =useState(locatiom.state?.email || "");
    console.log("Received Email:", email); 
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);


    useEffect(() => {
        if (timeLeft > 0) {
          const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
    
          return () => clearInterval(timer);
        } else {
          setCanResend(true);
        }
      }, [timeLeft]);


      const resendOTP = async () => {
        try {
          const response = await axios.post(`${baseUrl}/users/resendotp`, {
            email,
          });
    
          if (response.data.success) {
            toast.success("OTP resent successfully!");
            setTimeLeft(60); // Reset timer
            setCanResend(false);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Failed to resend OTP");
        }
      };


    const formik = useFormik({
        initialValues: {
            otp: "",
          },
          validationSchema: Yup.object({
            otp: Yup.string()
              .required("OTP is required")
              .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
          }),
          onSubmit: async (values) => {
            try {
              const response = await axios.post( `${baseUrl}/users/forgototpverify`, {
                email,
                otp: values.otp,
              });
      
              if (response.data.success) {
                toast.success("OTP verified successfully!");
                navigate("/resetpassword", { state: { email } }); 
              } else {
                toast.error(response.data.message);
              }
            } catch (error) {
              toast.error("Failed to verify OTP");
            }
          },
        });
  





  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor: "#1E40AF" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          OTP Verification
        </h2>
        {/* <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to your registered email address to continue.
        </p> */}

<p className="text-center text-red-600 font-semibold mb-4">
          OTP Expires In: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>

        <form className="space-y-5" onSubmit={formik.handleSubmit}>
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
              name="otp"
              placeholder="Enter your OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              maxLength={6}
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={timeLeft === 0}
            //   disabled
            />
            {/* <p className="text-red-700">Error message here</p> */}
            {formik.touched.otp && formik.errors.otp ? (
              <p className="text-red-700">{formik.errors.otp}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={formik.isSubmitting || timeLeft === 0}
          >
           {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
        {canResend && (
        <button
        className="text-blue-600 hover:underline" onClick={resendOTP}>
           Resend OTP
          </button>
           )}
        </div>

        {/* <div className="mt-4 text-red-600 text-center">
          <p>Error message here</p>
        </div> */}
      </div>
    </div>
  );
};

export default ForgotOtp;
