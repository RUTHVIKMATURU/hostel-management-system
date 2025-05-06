import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Mail, Phone, Home, BookOpen, Briefcase, Calendar, AlertCircle, UserPlus } from 'lucide-react';

const StudentSignup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:3000/student-api/signup', data);
            setSuccessMessage('Registration Successful! Redirecting to login...');

            // Navigate after a short delay to show the success message
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-logo">
                    <div className="signup-logo-circle">
                        <BookOpen size={32} color="#6C63FF" />
                    </div>
                </div>
                <h2 className="signup-title">Student Registration</h2>

                {errorMessage && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">
                        <User size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                    <div className="signup-form-grid">
                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <User size={20} className="signup-input-icon" />
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="Full Name"
                                    className="signup-input"
                                />
                            </div>
                            {errors.name && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.name.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <User size={20} className="signup-input-icon" />
                                <input
                                    {...register('rollNumber', { required: 'Roll Number is required' })}
                                    placeholder="Roll Number"
                                    className="signup-input"
                                />
                            </div>
                            {errors.rollNumber && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.rollNumber.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="signup-form-grid">
                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Briefcase size={20} className="signup-input-icon" />
                                <select
                                    {...register('branch', { required: 'Branch is required' })}
                                    className="signup-select"
                                >
                                    <option value="">Select Branch</option>
                                    <option value="CSE">Computer Science and Engineering (CSE)</option>
                                    <option value="CSE-AIML">CSE - Artificial Intelligence and Machine Learning</option>
                                    <option value="CSE-DS">CSE - Data Science</option>
                                    <option value="CSE-CYS">CSE - Cyber Security</option>
                                    <option value="CSE-IOT">CSE - Internet of Things</option>
                                    <option value="IT">Information Technology (IT)</option>
                                    <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                                    <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
                                    <option value="MECH">Mechanical Engineering</option>
                                    <option value="CIVIL">Civil Engineering</option>
                                    <option value="AUTO">Automobile Engineering</option>
                                </select>
                            </div>
                            {errors.branch && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.branch.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Calendar size={20} className="signup-input-icon" />
                                <select
                                    {...register('year', { required: 'Year is required' })}
                                    className="signup-select"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                            {errors.year && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.year.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="signup-form-grid">
                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Phone size={20} className="signup-input-icon" />
                                <input
                                    {...register('phoneNumber', {
                                        required: 'Phone Number is required',
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Please enter a valid 10-digit phone number"
                                        }
                                    })}
                                    placeholder="Phone Number"
                                    className="signup-input"
                                />
                            </div>
                            {errors.phoneNumber && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.phoneNumber.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Mail size={20} className="signup-input-icon" />
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    placeholder="Email"
                                    className="signup-input"
                                />
                            </div>
                            {errors.email && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.email.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="signup-form-grid">
                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Phone size={20} className="signup-input-icon" />
                                <input
                                    {...register('parentMobileNumber', {
                                        required: 'Parent Mobile Number is required',
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Please enter a valid 10-digit phone number"
                                        }
                                    })}
                                    placeholder="Parent Mobile Number"
                                    className="signup-input"
                                />
                            </div>
                            {errors.parentMobileNumber && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.parentMobileNumber.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="signup-form-group">
                            <div className="signup-input-container">
                                <Home size={20} className="signup-input-icon" />
                                <input
                                    {...register('roomNumber', { required: 'Room Number is required' })}
                                    placeholder="Room Number"
                                    className="signup-input"
                                />
                            </div>
                            {errors.roomNumber && (
                                <div className="signup-form-error">
                                    <AlertCircle size={16} />
                                    <span>{errors.roomNumber.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="signup-form-group">
                        <div className="signup-input-container">
                            <Lock size={20} className="signup-input-icon" />
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                placeholder="Password"
                                className="signup-input"
                            />
                        </div>
                        {errors.password && (
                            <div className="signup-form-error">
                                <AlertCircle size={16} />
                                <span>{errors.password.message}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="signup-button-spinner"></div>
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                <span>Register</span>
                            </>
                        )}
                    </button>

                    <div className="signup-footer">
                        Already have an account? <Link to="/login" className="signup-link">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default StudentSignup;

