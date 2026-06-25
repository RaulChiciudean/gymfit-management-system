import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
    const token = localStorage.getItem('token');
    let isAdmin = false;

    if (token && token !== 'undefined' && token !== 'null') {
        try {
            const decoded = jwtDecode(token);
            const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            isAdmin = roleClaim === 'Admin' || (Array.isArray(roleClaim) && roleClaim.includes('Admin'));
        } catch (error) {
            console.error("Error at reading the admin token:", error);
        }
    }

    return isAdmin ? <Outlet /> : <Navigate to="/library" replace />;
};

export default AdminRoute;