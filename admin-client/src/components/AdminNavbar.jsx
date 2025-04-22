import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/login');
    };

    return (
        <div>
            <nav style={styles.nav}>
                <div style={styles.navLinks}>
                    <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                    <Link to="/students" style={styles.link}>Students</Link>
                    <Link to="/complaints" style={styles.link}>Complaints</Link>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </nav>
            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};

const styles = {
    nav: {
        backgroundColor: '#2563eb',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navLinks: {
        display: 'flex',
        gap: '2rem',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        cursor: 'pointer',
    },
    main: {
        padding: '2rem',
    }
};

export default AdminNavbar;

