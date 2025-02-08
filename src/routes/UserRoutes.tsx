import React from "react";
import { Route,Routes } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import OtpPage from "../pages/auth/OtpPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login/> } />
            <Route path="/otp" element={<OtpPage /> } />
            <Route path="/forgotpassword" element={<ForgotPassword /> } />
            <Route path="/resetpassword" element={<ResetPassword /> } />
            
            


        </Routes>
    );
};

export default UserRoutes;