import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const AdminPrivateRoute = ({ children }) => {
    const [isValidating, setIsValidating] = useState(true);
    const location = useLocation();
    const { admin, setAdmin } = useAuth();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('adminToken');
            
            if (!token) {
                setIsValidating(false);
                return;
            }

            try {
                const response = await axios.get('/admin-api/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data.valid) {
                    const adminInfo = localStorage.getItem('adminInfo');
                    if (adminInfo) {
                        setAdmin(JSON.parse(adminInfo));
                    }
                } else {
                    throw new Error('Token invalid');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminInfo');
                setAdmin(null);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [setAdmin]);

    if (isValidating) {
        return <div>Loading...</div>;
    }

    if (!admin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminPrivateRoute;



