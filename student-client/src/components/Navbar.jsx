import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Bell, MessageSquare, LogOut, User,
    UserPlus, UserCircle, Settings, ChevronRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// Define theme colors - matching with RootLayout
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    surfaceHover: '#2D2D2D', // Hover state
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

const Navbar = ({ isDropdown = false, closeMenu = () => {} }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout(); // Use the logout function from context
        navigate('/login');
        closeMenu(); // Close the menu after logout
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeMenu(); // Close the menu after navigation
    };

    const navItems = user ? [
        { icon: <Home size={20} strokeWidth={2} />, label: 'Home', path: '/home' },
        { icon: <Bell size={20} strokeWidth={2} />, label: 'Announcements', path: '/announcements' },
        { icon: <MessageSquare size={20} strokeWidth={2} />, label: 'Complaints', path: '/complaints' },
        { icon: <LogOut size={20} strokeWidth={2} />, label: 'Outpass', path: '/outpass' },
        { icon: <UserCircle size={20} strokeWidth={2} />, label: 'Profile', path: '/profile' },
    ] : [
        { icon: <User size={20} strokeWidth={2} />, label: 'Login', path: '/login' },
        { icon: <UserPlus size={20} strokeWidth={2} />, label: 'Sign Up', path: '/signup' },
    ];

    if (!isDropdown) {
        // If not used as dropdown, return null
        return null;
    }

    return (
        <div style={styles.dropdownContainer}>
            <div style={styles.dropdownHeader}>
                <h3 style={styles.dropdownTitle}>Navigation</h3>
            </div>

            <nav style={styles.dropdownNav}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            style={{
                                ...styles.dropdownNavItem,
                                backgroundColor: isActive ? 'rgba(108, 99, 255, 0.15)' : 'transparent',
                                borderLeft: isActive ? `3px solid ${theme.primary}` : '3px solid transparent',
                            }}
                        >
                            <span style={{
                                ...styles.dropdownIcon,
                                color: isActive ? theme.primary : theme.textSecondary,
                            }}>
                                {item.icon}
                            </span>
                            <span style={{
                                ...styles.dropdownLabel,
                                color: isActive ? theme.text : theme.textSecondary,
                                fontWeight: isActive ? '600' : '400',
                            }}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span style={styles.activeIndicator}>
                                    <ChevronRight size={16} color={theme.primary} />
                                </span>
                            )}
                        </div>
                    );
                })}
            </nav>

            {user && (
                <div style={styles.dropdownFooter}>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(108, 99, 255, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(108, 99, 255, 0.2)';
                        }}
                    >
                        <LogOut size={18} style={{ marginRight: '8px' }} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    dropdownContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: theme.surface,
    },
    dropdownHeader: {
        padding: '0.5rem 0.75rem 1rem',
        borderBottom: `1px solid ${theme.divider}`,
    },
    dropdownTitle: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: '600',
        color: theme.text,
        letterSpacing: '0.5px',
    },
    dropdownNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0.75rem 0',
    },
    dropdownNavItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
    },
    dropdownIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s ease',
    },
    dropdownLabel: {
        fontSize: '0.95rem',
        transition: 'color 0.2s ease, font-weight 0.2s ease',
        flex: 1,
    },
    activeIndicator: {
        display: 'flex',
        alignItems: 'center',
    },
    dropdownFooter: {
        padding: '0.75rem',
        marginTop: '0.5rem',
        borderTop: `1px solid ${theme.divider}`,
    },
    logoutButton: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: theme.primary,
        color: theme.text,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(108, 99, 255, 0.2)',
    },
};

export default Navbar
