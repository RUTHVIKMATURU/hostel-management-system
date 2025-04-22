import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('studentToken');

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <Navbar />
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
        flexDirection: 'column'
    },
    navbar: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%'
    },
    main: {
        flex: 1,
        padding: '2rem'
    }
};

export default RootLayout
