import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const StudentSignup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/student-api/signup', data);
            alert('Registration Successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Student Registration</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Full Name"
                            style={styles.input}
                        />
                        {errors.name && <span style={styles.error}>{errors.name.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            {...register('rollNumber', { required: 'Roll Number is required' })}
                            placeholder="Roll Number"
                            style={styles.input}
                        />
                        {errors.rollNumber && <span style={styles.error}>{errors.rollNumber.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <select 
                            {...register('branch', { required: 'Branch is required' })}
                            style={styles.select}
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
                        {errors.branch && <span style={styles.error}>{errors.branch.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <select 
                            {...register('year', { required: 'Year is required' })}
                            style={styles.select}
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                        {errors.year && <span style={styles.error}>{errors.year.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            {...register('phoneNumber', { 
                                required: 'Phone Number is required',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit phone number"
                                }
                            })}
                            placeholder="Phone Number"
                            style={styles.input}
                        />
                        {errors.phoneNumber && <span style={styles.error}>{errors.phoneNumber.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Email"
                            style={styles.input}
                        />
                        {errors.email && <span style={styles.error}>{errors.email.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            {...register('parentMobileNumber', { 
                                required: 'Parent Mobile Number is required',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit phone number"
                                }
                            })}
                            placeholder="Parent Mobile Number"
                            style={styles.input}
                        />
                        {errors.parentMobileNumber && <span style={styles.error}>{errors.parentMobileNumber.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            {...register('roomNumber', { required: 'Room Number is required' })}
                            placeholder="Room Number"
                            style={styles.input}
                        />
                        {errors.roomNumber && <span style={styles.error}>{errors.roomNumber.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
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
                            style={styles.input}
                        />
                        {errors.password && <span style={styles.error}>{errors.password.message}</span>}
                    </div>

                    <button type="submit" style={styles.button}>
                        Register
                    </button>

                    <p style={styles.loginText}>
                        Already have an account? <Link to="/login" style={styles.loginLink}>Login here</Link>
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
    select: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '16px',
        backgroundColor: '#fff',
        cursor: 'pointer',
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
    loginText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    loginLink: {
        color: '#FFAE00',
        textDecoration: 'none',
        fontWeight: '600',
        ':hover': {
            textDecoration: 'underline',
        },
    },
};

export default StudentSignup;

