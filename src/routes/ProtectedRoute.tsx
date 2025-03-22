import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || allowedRoles.includes('admin');


  const user = useSelector((state: RootState) => state.user.user); 
  const userIsAuthenticated = !!user; 

 
  const admin = useSelector((state: RootState) => state.admin.admin); 
  const adminIsAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated); 

  console.log("ProtectedRoute check:", { isAdminRoute, adminIsAuthenticated, admin, userIsAuthenticated, user, allowedRoles });

  if (isAdminRoute) {
    if (!adminIsAuthenticated || !admin) {
      console.log("Redirecting to admin login - not authenticated");
      return <Navigate to="/admin/login" replace />;
    }
    const adminRole = admin.role || ""; // Default to 'admin' if role isn’t set
    if (!allowedRoles.includes(adminRole)) {
      console.log("Admin doesn't have required role");
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!userIsAuthenticated || !user) {
      console.log("Redirecting to user login - not authenticated");
      return <Navigate to="/login" replace />;
    }
    const userRole = user.role || ""; // Default to 'User' if role isn’t set
    if (!allowedRoles.includes(userRole)) {
      console.log("User doesn't have required role");
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>; // Render children instead of Outlet
};

export default ProtectedRoute;