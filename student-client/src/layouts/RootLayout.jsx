import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

const RootLayout = () => {
    const { user } = useUser();

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
