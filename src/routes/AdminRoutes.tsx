import React from "react";
import { Route,Routes } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminStudentsPage from "../pages/admin/AdminStudentsPage";


const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/dashboard" element={<AdminDashboard />}/>
            <Route path="/studentslist" element ={<AdminStudentsPage />} />
        </Routes>
    )
}

export default AdminRoutes;