import React from "react";
import { Route,Routes } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../components/admin/AdminDashboard";


const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/dashboard" element={<AdminDashboard />}/>
        </Routes>
    )
}

export default AdminRoutes;