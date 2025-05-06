import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard, Users, MessageSquare,
    LogOut, FileText, ChevronRight, Settings,
    BarChart
} from 'lucide-react';
const theme = {
    primary: '#00BFA6', // Teal accent
    primaryDark: '#00A896',
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    surfaceHover: '#2D2D2D', // Hover state
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    accent: '#00BFA6', // Teal accent
    error: '#CF6679',
    divider: '#2D2D2D',
    overlay: 'rgba(0, 0, 0, 0.5)',
    elevation1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    elevation2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    elevation3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
};

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/login');
    };

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

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false); // Close the menu after navigation
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} strokeWidth={2} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={20} strokeWidth={2} />, label: 'Students', path: '/students' },
        { icon: <MessageSquare size={20} strokeWidth={2} />, label: 'Complaints', path: '/complaints' },
        { icon: <FileText size={20} strokeWidth={2} />, label: 'Outpass Requests', path: '/requests' },
        { icon: <BarChart size={20} strokeWidth={2} />, label: 'Analysis', path: '/analysis' },
        { icon: <Settings size={20} strokeWidth={2} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div style={styles.container}>
            {/* Top Bar */}
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

                    {/* Dropdown Menu with Animation */}
                    <div
                        ref={menuRef}
                        style={{
                            ...styles.dropdown,
                            opacity: menuOpen ? 1 : 0,
                            visibility: menuOpen ? 'visible' : 'hidden',
                            transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
                        }}
                    >
                        <div style={styles.dropdownHeader}>
                            <h3 style={styles.dropdownTitle}>Admin Menu</h3>
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
                                            backgroundColor: isActive ? 'rgba(0, 191, 166, 0.15)' : 'transparent',
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

                        <div style={styles.dropdownFooter}>
                            <button
                                onClick={handleLogout}
                                style={styles.logoutButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 191, 166, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 191, 166, 0.2)';
                                }}
                            >
                                <LogOut size={18} style={{ marginRight: '8px' }} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <h1 style={styles.title}>
                    <span style={styles.titleAccent}>Admin</span> Portal
                </h1>
            </div>

            {/* Main Content Area */}
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
    dropdownHeader: {
        padding: '0.75rem 1rem 1rem',
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
        padding: '0.75rem 0.5rem',
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
        padding: '0.75rem 1rem',
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
        boxShadow: '0 2px 10px rgba(0, 191, 166, 0.2)',
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.text,
        letterSpacing: '0.5px',
    },
    titleAccent: {
        color: theme.primary,
    },
    main: {
        flex: 1,
        padding: '2rem',
        backgroundColor: theme.background,
    }
};

export default AdminNavbar;

