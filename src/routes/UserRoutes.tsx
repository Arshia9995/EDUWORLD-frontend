import React from "react";
import { Route,Routes } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import OtpPage from "../pages/auth/OtpPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotOtpPage from "../pages/auth/ForgotOtpPage";
import ProfilePage from "../pages/user/ProfilePage";
import RegistrationFormPage from "../pages/user/instructor/RegistrationFormPage";
import InstructorDashboardPage from "../pages/instructor/InstructorDashboardPage";

const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login/> } />
            <Route path="/otp" element={<OtpPage /> } />
            <Route path="/forgotpassword" element={<ForgotPassword /> } />
            <Route path="/resetpassword" element={<ResetPassword /> } />
            <Route path ="/forgototp" element= {<ForgotOtpPage />} />
            <Route path ="/profile" element= {<ProfilePage />} />
            <Route path ="/instructorregistration" element= {<RegistrationFormPage />} />
            <Route path ="/instructordashboard" element= {<InstructorDashboardPage />} />
            
            


        </Routes>
    );
};

export default UserRoutes;