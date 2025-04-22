import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, MessageSquare, LogOut, User, UserPlus } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('studentToken');
    const studentInfo = isLoggedIn ? JSON.parse(localStorage.getItem('studentInfo')) : null;

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
        navigate('/login');
    };

    const navItems = isLoggedIn ? [
        { icon: <Home size={20} />, label: 'Home', path: '/home' },
        { icon: <Bell size={20} />, label: 'Announcements', path: '/announcements' },
        { icon: <MessageSquare size={20} />, label: 'Complaints', path: '/complaints' },
        { icon: <LogOut size={20} />, label: 'Outpass', path: '/outpass' },
    ] : [
        { icon: <User size={20} />, label: 'Login', path: '/login' },
        { icon: <UserPlus size={20} />, label: 'Sign Up', path: '/signup' },
    ];

    return (
        <div style={styles.navbar}>
            <div style={styles.content}>
                <Link to={isLoggedIn ? '/home' : '/'} style={styles.titleLink}>
                    <h1 style={styles.title}>Student Portal</h1>
                </Link>
                
                <nav style={styles.nav}>
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            style={{
                                ...styles.navItem,
                                backgroundColor: location.pathname === item.path ? '#FFAE00' : 'transparent',
                                color: location.pathname === item.path ? '#fff' : '#333'
                            }}
                        >
                            <span style={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {isLoggedIn && studentInfo && (
                    <div style={styles.profile}>
                        <Link to="/profile" style={styles.profileLink}>
                            <div style={styles.avatar}>
                                {studentInfo.name?.[0] || 'S'}
                            </div>
                            <div style={styles.userInfo}>
                                <p style={styles.userName}>{studentInfo.name}</p>
                                <p style={styles.userId}>ID: {studentInfo.rollNumber}</p>
                            </div>
                        </Link>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleLink: {
        textDecoration: 'none',
        color: '#333',
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    nav: {
        display: 'flex',
        gap: '1rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        borderRadius: '4px',
        transition: 'all 0.2s',
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    profileLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: '#333',
    },
    avatar: {
        width: '40px',
        height: '40px',
        backgroundColor: '#FFAE00',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        margin: 0,
        fontWeight: 'bold',
    },
    userId: {
        margin: 0,
        fontSize: '0.8rem',
        color: '#666',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#ff4444',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#cc0000',
        },
    },
};

export default Navbar
