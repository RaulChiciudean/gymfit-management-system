import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = () => {
    const { token, loading } = useContext(AuthContext);


    if (loading) {
        return <div>Loading...</div>;
    }
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;