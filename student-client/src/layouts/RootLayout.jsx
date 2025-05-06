import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { useState, useRef, useEffect } from 'react';

// Define theme colors
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    accent: '#6C63FF', // Purple accent
    error: '#CF6679',
    divider: '#2D2D2D',
    overlay: 'rgba(0, 0, 0, 0.5)',
    elevation1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    elevation2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    elevation3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
};

const RootLayout = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    // Apply dark theme to body
    useEffect(() => {
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.text;
        document.body.style.margin = '0';
        document.body.style.fontFamily = "'Poppins', 'Segoe UI', 'Roboto', sans-serif";

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.margin = '';
            document.body.style.fontFamily = '';
        };
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <div style={styles.menuContainer}>
                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        style={styles.menuButton}
                        aria-label="Toggle menu"
                    >
                        <div style={{
                            ...styles.menuIcon,
                            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                        }}></div>
                        <div style={{
                            ...styles.menuIcon,
                            opacity: menuOpen ? 0 : 1,
                            transform: menuOpen ? 'translateX(-20px)' : 'none',
                        }}></div>
                        <div style={{
                            ...styles.menuIcon,
                            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                        }}></div>
                    </button>

                    <div
                        ref={menuRef}
                        style={{
                            ...styles.dropdown,
                            opacity: menuOpen ? 1 : 0,
                            visibility: menuOpen ? 'visible' : 'hidden',
                            transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
                        }}
                    >
                        <Navbar isDropdown={true} closeMenu={() => setMenuOpen(false)} />
                    </div>
                </div>

                <h1 style={styles.title}>
                    <span style={styles.titleAccent}>Student</span> Portal
                </h1>

                {user && (
                    <div
                        style={styles.userInfo}
                        onClick={() => navigate('/profile')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={styles.avatar}>
                            {user.name?.[0] || 'S'}
                        </div>
                        <div style={styles.userDetails}>
                            <p style={styles.userName}>{user.name}</p>
                            <p style={styles.userId}>ID: {user.rollNumber}</p>
                        </div>
                    </div>
                )}
            </div>

            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.background,
        color: theme.text,
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: theme.surface,
        boxShadow: theme.elevation2,
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backdropFilter: 'blur(10px)',
    },
    menuContainer: {
        position: 'relative',
        marginRight: '1.5rem',
    },
    menuButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '24px',
        padding: '0',
        zIndex: 1001,
    },
    menuIcon: {
        width: '24px',
        height: '2px',
        backgroundColor: theme.text,
        margin: '2px 0',
        borderRadius: '3px',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        left: '0',
        backgroundColor: theme.surface,
        boxShadow: theme.elevation3,
        borderRadius: '12px',
        width: '280px',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease',
        border: `1px solid ${theme.divider}`,
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.text,
        flex: 1,
        letterSpacing: '0.5px',
    },
    titleAccent: {
        color: theme.primary,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '50px',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        transition: theme.transition,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(108, 99, 255, 0.15)',
        },
    },
    avatar: {
        width: '40px',
        height: '40px',
        backgroundColor: theme.primary,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text,
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(108, 99, 255, 0.5)',
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        margin: 0,
        fontWeight: 'bold',
        color: theme.text,
    },
    userId: {
        margin: 0,
        fontSize: '0.8rem',
        color: theme.textSecondary,
    },
    main: {
        flex: 1,
        padding: '2rem',
        backgroundColor: theme.background,
    }
};

export default RootLayout
