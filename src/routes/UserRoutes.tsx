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
import ProtectedRoute from "./ProtectedRoute";
import InstructorCourselist from "../components/user/instructor/InstructorCourselist";
import InstructorCoursePage from "../pages/instructor/InstructorCoursePage";
import InstructorAddCourse from "../components/user/instructor/InstructorAddCourse";
import InstructorAddLesson from "../components/user/instructor/InstructorAddLesson";

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


            <Route path ="/profile"
             element= {
                <ProtectedRoute allowedRoles={["student", "instructor"]}>
             <ProfilePage />
             </ProtectedRoute>
             } />
            <Route path ="/instructorregistration"
             element= {
                <ProtectedRoute allowedRoles={["instructor"]}>
             <RegistrationFormPage />
             </ProtectedRoute>
             } />
            <Route path ="/instructordashboard"
             element= {
                <ProtectedRoute allowedRoles={["instructor"]}>
             <InstructorDashboardPage />
             </ProtectedRoute>
            } />

             <Route path ="/instructorcourses"
             element= {
                <ProtectedRoute allowedRoles={["instructor"]}>
             <InstructorCoursePage />
             </ProtectedRoute>
            } />

           <Route path ="/instructoraddcourse"
             element= {
                <ProtectedRoute allowedRoles={["instructor"]}>
             <InstructorAddCourse />
             </ProtectedRoute>
            } />

           <Route path ="/instructoraddlesson"
             element= {
                <ProtectedRoute allowedRoles={["instructor"]}>
             <InstructorAddLesson />
             </ProtectedRoute>
            } />
            
            


        </Routes>
    );
};

export default UserRoutes;