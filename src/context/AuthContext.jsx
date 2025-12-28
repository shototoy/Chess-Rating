import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verify token on mount
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (data.success) {
                    setUser(data.admin);
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = (userData, newToken) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
