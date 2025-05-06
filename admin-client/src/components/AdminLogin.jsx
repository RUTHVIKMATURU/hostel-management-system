import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/admin-api/login', data);

            if (response.data.token && response.data.admin) {
                // Use the login function from context
                login(response.data.admin, response.data.token);

                // Navigate to dashboard or intended destination
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('password', {
                type: 'manual',
                message: error.response?.data?.message || 'Login failed'
            });
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <div className="admin-logo-circle">
                        <User size={32} color="#00BFA6" />
                    </div>
                </div>
                <h2 className="admin-login-title">Admin Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form">
                    <div className="admin-form-group">
                        <div className="admin-input-container">
                            <User size={20} className="admin-input-icon" />
                            <input
                                {...register('username', {
                                    required: 'Username is required'
                                })}
                                placeholder="Username"
                                className="admin-input"
                            />
                        </div>
                        {errors.username && (
                            <div className="admin-form-error">
                                <AlertCircle size={16} />
                                <span>{errors.username.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="admin-form-group">
                        <div className="admin-input-container">
                            <Lock size={20} className="admin-input-icon" />
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required'
                                })}
                                placeholder="Password"
                                className="admin-input"
                            />
                        </div>
                        {errors.password && (
                            <div className="admin-form-error">
                                <AlertCircle size={16} />
                                <span>{errors.password.message}</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="admin-login-button">
                        <LogIn size={20} />
                        <span>Login</span>
                    </button>
                </form>
            </div>
        </div>
    );
};



export default AdminLogin;

