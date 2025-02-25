import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { OtpValidationSchema } from "../../schemas/OtpValidationSchema";
import { verifyOtp } from "../../redux/actions/userActions";
import { AppDispatch } from "../../redux/store";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../config/constants";


interface TempData {
  name: string;
  email: string;
  password: string;
  otp?: string;
  role: "student" | "instructor";
}

interface LocationState {
  userData: TempData;
}
interface OtpVerificationState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const OtpVerification: React.FC<{userData: TempData}> = ({ userData: propUserData }) => {
 
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const userData: TempData = {
    ...locationState?.userData,
    ...propUserData
  };

  const otpState = useSelector((state: any) => state.user.OtpVerification) as OtpVerificationState;

  const [timeLeft, setTimeLeft]= useState(60)
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false); 
    }
  }, [timeLeft]);


  const handleResendOtp = async () => {
    if(!userData.email){
      toast.error("Email is required for resending OTP.");
      return;

    }

    try {
      setResendDisabled(true);
      setTimeLeft(60);

      const response = await axios.post(`${baseUrl}/users/resendotp`,{ email: userData.email });

      if (response.data.success) {
        toast.success("OTP Resent Successfully. Please check your email.");
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
      }
    } catch (error: any){
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
      
    }

    }
  

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OtpValidationSchema,
    onSubmit: async (values) => {
      console.log("called submit funvtion", userData)
      if (!userData?.email || !userData?.password || !userData?.role) {
        toast.error("Missing required user information");
        return;
      }
      if(userData){
        try {
          const result = await dispatch(verifyOtp({  otp: values.otp, 
            email: userData.email,
            password: userData.password,
            role: userData.role })).unwrap();
          if (result) {
            toast.success("OTP verified successfully!");
            if(userData.role === "instructor"){
               navigate("/instructorregistration");
            }else {
            navigate("/",{ replace: true });
            }
          }
        } catch (error: any) {
          console.error("OTP verification error:", error);
          if (error.message) {
            toast.error(error.message);
          }else 
          toast.error(error.message || "OTP verification failed");
        }
        }
      
    },
  });


  useEffect(() => {
    if (otpState?.success) {
      navigate("/");
    }
  }, [otpState?.success, navigate]);
  // if(otpState.success){
  //   navigate("/")
  // }


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundColor: "#1E40AF", 
      }}
    >
     
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
       

      
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          OTP Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to your registered email address to continue.
        </p>

         
        <p className="text-center text-red-600 font-semibold mb-4">OTP Expires In: {formatTime(timeLeft)}</p>
       
        <form onSubmit={formik.handleSubmit} className="space-y-5">
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
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              maxLength={6}
              disabled={timeLeft === 0}
              // required
            />
             {formik.touched.otp && formik.errors.otp && (
              <p className="text-red-700">{formik.errors.otp}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
  disabled={otpState.loading || timeLeft === 0} // Disable when loading or timer reaches 0

          >
            {otpState.loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

       
        <div className="mt-6 text-center">
          <button
           className={`text-blue-600 ${resendDisabled ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
           disabled={resendDisabled}
           onClick={handleResendOtp}  
          >
            Resend OTP
          </button>
        </div>

        {otpState.error && (
          <div className="mt-4 text-red-600 text-center">
            <p>{otpState.error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OtpVerification;
