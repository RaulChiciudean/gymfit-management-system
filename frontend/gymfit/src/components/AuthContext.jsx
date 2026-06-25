import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Safely initialize token
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return (savedToken && savedToken !== 'undefined' && savedToken !== 'null') ? savedToken : null;
    });

    // Safely initialize user and prevent JSON.parse crashes
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
            return null;
        }
        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Failed to parse user data from localStorage:", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    const login = (newToken, userData = null) => {
        localStorage.setItem('token', newToken);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};