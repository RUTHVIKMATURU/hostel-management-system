import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import img5 from '../assets/5.jpg';

const StudentLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useUser();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/student-api/login', data);
            login(response.data.student);
            localStorage.setItem('token', response.data.token);
            alert('Login Successful!');
            navigate('/home');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ ...styles.background, backgroundImage: `url(${img5})` }}>
            <div style={styles.container}>
                <h2 style={styles.title}>Student Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Roll Number</label>
                        <input
                            type="text"
                            placeholder="Enter your roll number"
                            {...register('rollNumber', { required: 'Roll number is required' })}
                            style={styles.input}
                        />
                        {errors.rollNumber && <small style={styles.error}>{errors.rollNumber.message}</small>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', { required: 'Password is required' })}
                            style={styles.input}
                        />
                        {errors.password && <small style={styles.error}>{errors.password.message}</small>}
                    </div>

                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    background: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    container: {
        maxWidth: '400px',
        width: '90%',
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
    title: {
        marginBottom: '1.5rem',
        fontSize: '2rem',
        color: '#2C3E50',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '1.2rem',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '0.8rem',
        border: 'none',
        borderRadius: '8px',
        outline: 'none',
        fontSize: '1rem',
        backgroundColor: '#F3F4F6',
    },
    button: {
        padding: '0.8rem',
        backgroundColor: '#1A237E',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background 0.3s',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
    },
};

export default StudentLogin;
