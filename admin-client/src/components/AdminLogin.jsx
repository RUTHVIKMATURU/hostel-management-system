import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';

const AdminLogin = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/admin-api/login', data);
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
            
            // Redirect to the attempted URL or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            setError('password', {
                type: 'manual',
                message: error.response?.data?.message || 'Login failed'
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Admin Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            {...register('username', { 
                                required: 'Username is required'
                            })}
                            placeholder="Username"
                            style={styles.input}
                        />
                        {errors.username && (
                            <span style={styles.error}>{errors.username.message}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            type="password"
                            {...register('password', { 
                                required: 'Password is required'
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
    },
    error: {
        color: '#dc2626',
        fontSize: '14px',
        marginTop: '4px',
    },
    button: {
        backgroundColor: '#2563eb',
        color: '#fff',
        padding: '14px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default AdminLogin;

