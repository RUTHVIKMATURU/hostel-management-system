import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('adminToken');
            const adminInfo = localStorage.getItem('adminInfo');

            if (token && adminInfo) {
                try {
                    // Verify token on initial load
                    const response = await axios.get('/admin-api/verify-token', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    if (response.data.valid) {
                        setAdmin(JSON.parse(adminInfo));
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    } else {
                        throw new Error('Token invalid');
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminInfo');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (adminData, token) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminInfo', JSON.stringify(adminData));
        setAdmin(adminData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setAdmin(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ admin, setAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
