import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/Auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error(err);
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, [token]);

    const login = (jwt) => {
        localStorage.setItem('token', jwt);
        setToken(jwt);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};