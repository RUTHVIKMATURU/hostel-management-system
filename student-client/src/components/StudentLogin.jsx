import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useUser } from '../context/UserContext';

const StudentLogin = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors } 
    } = useForm();

    const onSubmit = async (data) => {
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
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Student Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            {...register('rollNumber', { 
                                required: 'Roll Number is required',
                                minLength: {
                                    value: 3,
                                    message: 'Roll Number must be at least 3 characters'
                                }
                            })}
                            placeholder="Roll Number"
                            style={styles.input}
                        />
                        {errors.rollNumber && (
                            <span style={styles.error}>{errors.rollNumber.message}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
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
                            style={styles.input}
                        />
                        {errors.password && (
                            <span style={styles.error}>{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" style={styles.button}>
                        Login
                    </button>

                    <p style={styles.signupText}>
                        Don't have an account? <Link to="/signup" style={styles.signupLink}>Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        outline: 'none',
        ':focus': {
            borderColor: '#FFAE00',
        },
    },
    error: {
        color: '#dc2626',
        fontSize: '14px',
        marginTop: '4px',
    },
    button: {
        backgroundColor: '#FFAE00',
        color: '#fff',
        padding: '14px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#E59D00',
        },
    },
    signupText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    signupLink: {
        color: '#FFAE00',
        textDecoration: 'none',
        fontWeight: '600',
        ':hover': {
            textDecoration: 'underline',
        },
    },
};

export default StudentLogin;
