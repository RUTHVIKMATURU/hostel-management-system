import React from 'react'
import { useUser } from '../context/UserContext'
import { Home, Bell, Users, MessageSquare, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user } = useUser()
    
    const navbarStyle = {
        backgroundColor: '#FFBF00',
        minHeight:"90vh",
        minWidth:"15vw",
        
        display: 'flex',
        flexDirection: 'column'
    };
    
    const headerStyle = {
        padding: '1rem',
        textAlign: 'center'
    };
    
    const navStyle = {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        padding: '0.5rem'
    };
    
    const profileContainerStyle = {
        marginTop: 'auto',
        padding: '1rem',
        borderTop: '1px solid #FFAE00'
    };
    
    const profileStyle = {
        display: 'flex',
        alignItems: 'center'
    };
    
    const avatarStyle = {
        backgroundColor: '#0D6EFD',
        color: 'white',
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '0.5rem'
    };
    
    return (
        <div style={navbarStyle}>
            <div style={headerStyle}>
                <h1 className="h4 mb-0 fw-bold">Student Portal</h1>
            </div>
            
            <nav style={navStyle}>
                <NavItem icon={<Home size={20} />} label="Home" to="" />
                <NavItem icon={<Bell size={20} />} label="Announcements" to="announcements" />
                {/* <NavItem icon={<Users size={20} />} label="Community" to="community" /> */}
                <NavItem icon={<MessageSquare size={20} />} label="Complaints" to="complaints" />
                <NavItem icon={<LogOut size={20} />} label="Outpass" to="outpass" />
                <NavItem icon={<User size={20} />} label="Student Profile" to="profile" />
            </nav>
            
            <div style={profileContainerStyle}>
                <div style={profileStyle}>
                    <div style={avatarStyle}>
                        <span>S</span>
                    </div>
                    <div>
                        <p className="mb-0 fw-medium">{user.name}</p>
                        <p className="mb-0 small text-muted">ID: {user.rollNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const NavItem = ({ icon, label, to }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    const navItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        backgroundColor: isHovered ? '#FFAE00' : 'transparent',
        textDecoration: 'none',
        color: 'inherit'
    };
    
    const iconStyle = {
        marginRight: '0.5rem'
    };
    
    return (
        <Link 
            to={to}
            style={navItemStyle}
            className="nav-item"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={iconStyle}>{icon}</div>
            <span className="fw-medium">{label}</span>
        </Link>
    );
};

export default Navbar