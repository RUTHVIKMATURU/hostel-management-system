import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useUser } from '../context/UserContext';
import { User, Lock, LogIn, AlertCircle, BookOpen } from 'lucide-react';

const StudentLogin = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post('/student-api/login', {
                rollNumber: data.rollNumber,
                password: data.password
            });

            if (response.data.token && response.data.student) {
                localStorage.setItem('studentToken', response.data.token);
                login(response.data.student);
                navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response?.status === 401) {
                setError('password', {
                    type: 'manual',
                    message: 'Invalid credentials'
                });
            } else {
                setError('password', {
                    type: 'manual',
                    message: 'Login failed. Please try again.'
                });
            }

            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-circle">
                        <BookOpen size={32} color="#6C63FF" />
                    </div>
                </div>
                <h2 className="login-title">Student Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="login-form-group">
                        <div className="login-input-container">
                            <User size={20} className="login-input-icon" />
                            <input
                                {...register('rollNumber', {
                                    required: 'Roll Number is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Roll Number must be at least 3 characters'
                                    }
                                })}
                                placeholder="Roll Number"
                                className="login-input"
                            />
                        </div>
                        {errors.rollNumber && (
                            <div className="login-form-error">
                                <AlertCircle size={16} />
                                <span>{errors.rollNumber.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="login-form-group">
                        <div className="login-input-container">
                            <Lock size={20} className="login-input-icon" />
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                placeholder="Password"
                                className="login-input"
                            />
                        </div>
                        {errors.password && (
                            <div className="login-form-error">
                                <AlertCircle size={16} />
                                <span>{errors.password.message}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="login-button-spinner"></div>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Login</span>
                            </>
                        )}
                    </button>

                    <div className="login-footer">
                        Don't have an account? <Link to="/signup" className="login-link">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default StudentLogin;
