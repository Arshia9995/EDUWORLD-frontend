import React from "react";
import { Route,Routes } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminStudentsPage from "../pages/admin/AdminStudentsPage";
import AdminInstructorsPage from "../pages/admin/AdminInstructorsPage";
import ApprovedInstructorsPage from "../pages/admin/ApprovedInstructorsPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminCategoryPage from "../pages/admin/AdminCategoryPage";
import AddCategoryPage from "../pages/admin/AddCategoryPage";
import EditCategoryPage from "../pages/admin/EditCategoryPage";
import InstructorCoursePage from "../pages/instructor/InstructorCoursePage";
import AdminWallet from "../components/admin/AdminWallet";
import AdminPaymentHistory from "../components/admin/AdminPaymentHistory";
import Announcements from "../components/admin/Announcements";

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={<AdminLoginPage />} />

            {/* Protected Routes for Admins */}
        
            <Route path="/dashboard"
             element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                    </ProtectedRoute>
                    }/>
            <Route path="/studentslist"
             element ={
                <ProtectedRoute allowedRoles={['admin']}>
             <AdminStudentsPage />
             </ProtectedRoute>
            } />
            <Route path="/instructorslist"
            element ={
                <ProtectedRoute allowedRoles={['admin']}>
            <AdminInstructorsPage />
            </ProtectedRoute>}
             />
            <Route path="/approvedinstructors"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <ApprovedInstructorsPage />
             </ProtectedRoute>
            } />
            <Route path="/categories"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <AdminCategoryPage />
             </ProtectedRoute>
            } />
           
           <Route path="/addcategory"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <AddCategoryPage />
             </ProtectedRoute>
            } />

            <Route path="/editcategory"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <EditCategoryPage />
             </ProtectedRoute>
            } />

            <Route path="/adminwallet"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <AdminWallet />
             </ProtectedRoute>
            } />
              <Route path="/payment-history"
             element ={
            <ProtectedRoute allowedRoles={['admin']}>
             <AdminPaymentHistory />
             </ProtectedRoute>
            } />

            <Route path="/announcements"
             element ={
            // <ProtectedRoute allowedRoles={['admin']}>
             <Announcements />
            //  </ProtectedRoute>
            } />
        </Routes>
    )
}

export default AdminRoutes;