import { Navigate, useLocation } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const location = useLocation();
    
    if (!token) {
        // Redirect to login while saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

export default AdminPrivateRoute;
