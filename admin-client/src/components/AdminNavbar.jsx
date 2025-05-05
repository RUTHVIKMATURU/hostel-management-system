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
                    <Link to="/requests" style={styles.link}>Outpass Requests</Link>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#FFAE00', // Updated to yellow
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    navLinks: {
        display: 'flex',
        gap: '1.5rem'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: '500',
        padding: '0.5rem 0',
        borderBottom: '2px solid transparent',
        transition: 'border-color 0.3s',
        '&:hover': {
            borderColor: 'white'
        }
    },
    logoutButton: {
        backgroundColor: 'white',
        color: '#FFAE00', // Updated to yellow
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#f0f0f0'
        }
    },
    main: {
        padding: '2rem'
    }
};

export default AdminNavbar;

