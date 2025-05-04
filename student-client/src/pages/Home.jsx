import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get student info from localStorage
        const storedInfo = localStorage.getItem('studentInfo');
        if (storedInfo) {
            setStudentInfo(JSON.parse(storedInfo));
        }

        // Fetch recent announcements (last 2 days)
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                // Try with port 3000 instead of 4000
                const response = await axios.get('http://localhost:3000/student-api/all-announcements', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('studentToken')}`
                    }
                });
                
                console.log('Fetched announcements:', response.data);
                
                // Filter announcements from the last 2 days
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                console.log('Two days ago:', twoDaysAgo);
                
                const recentAnnouncements = response.data.filter(announcement => {
                    // Fix: Handle both createdAt and dateTime fields
                    const dateField = announcement.createdAt || announcement.dateTime;
                    console.log('Announcement date field:', dateField);
                    
                    // Fix: Ensure proper date parsing
                    const announcementDate = new Date(dateField);
                    console.log('Parsed announcement date:', announcementDate);
                    
                    // Check if date is valid before comparison
                    if (isNaN(announcementDate.getTime())) {
                        console.error('Invalid date for announcement:', announcement);
                        return false;
                    }
                    
                    const isRecent = announcementDate >= twoDaysAgo;
                    console.log('Is recent:', isRecent);
                    return isRecent;
                });
                
                console.log('Filtered recent announcements:', recentAnnouncements);
                setRecentAnnouncements(recentAnnouncements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                console.error('Error details:', error.response?.data || error.message);
                setError('Failed to load announcements. Please try again later.');
                setLoading(false);
                
                // Try to fetch without authentication as fallback
                try {
                    const fallbackResponse = await axios.get('http://localhost:3000/student-api/all-announcements');
                    if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
                        console.log('Fallback fetch successful:', fallbackResponse.data);
                        
                        const twoDaysAgo = new Date();
                        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                        
                        const recentAnnouncements = fallbackResponse.data.filter(announcement => {
                            const dateField = announcement.createdAt || announcement.dateTime;
                            const announcementDate = new Date(dateField);
                            return !isNaN(announcementDate.getTime()) && announcementDate >= twoDaysAgo;
                        });
                        
                        setRecentAnnouncements(recentAnnouncements);
                        setError(null);
                        setLoading(false);
                    }
                } catch (fallbackError) {
                    console.error('Fallback fetch also failed:', fallbackError);
                }
            }
        };

        fetchAnnouncements();
    }, []);

    const handleQuickLinkClick = (path) => {
        navigate(path);
    };

    return (
        <div style={styles.container}>
            {/* Welcome Section */}
            <section style={styles.welcomeSection}>
                <h1 style={styles.welcomeTitle}>
                    Welcome, {studentInfo?.name || 'Student'}!
                </h1>
                <p style={styles.welcomeText}>
                    Access all your hostel services and information in one place.
                </p>
            </section>

            {/* Quick Links */}
            <section style={styles.quickLinksSection}>
                <h2 style={styles.sectionTitle}>Quick Links</h2>
                <div style={styles.quickLinksGrid}>
                    <div 
                        style={styles.quickLink} 
                        onClick={() => handleQuickLinkClick('/outpass')}
                    >
                        <h3>Outpass</h3>
                        <p>Apply for hostel outpass</p>
                    </div>
                    <div 
                        style={styles.quickLink}
                        onClick={() => handleQuickLinkClick('/complaints/complaint')}
                    >
                        <h3>Complaints</h3>
                        <p>Register your complaints</p>
                    </div>
                    <div 
                        style={styles.quickLink}
                        onClick={() => handleQuickLinkClick('/announcements/all')}
                    >
                        <h3>Announcements</h3>
                        <p>View latest updates</p>
                    </div>
                </div>
            </section>

            {/* Recent Announcements (Last 2 Days) */}
            <section style={styles.announcementsSection}>
                <h2 style={styles.sectionTitle}>Recent Announcements (Last 2 Days)</h2>
                <div style={styles.announcementsList}>
                    {loading ? (
                        <div style={styles.loadingMessage}>Loading announcements...</div>
                    ) : error ? (
                        <div style={styles.errorMessage}>
                            {error}
                            <button 
                                onClick={() => window.location.reload()} 
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: '#FFAE00',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : recentAnnouncements.length > 0 ? (
                        recentAnnouncements.map((announcement, index) => (
                            <div key={index} style={styles.announcementCard}>
                                <h3 style={styles.announcementTitle}>{announcement.title}</h3>
                                <p style={styles.announcementDate}>
                                    {new Date(announcement.createdAt || announcement.dateTime).toLocaleDateString()} 
                                    {" "}
                                    {new Date(announcement.createdAt || announcement.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <p style={styles.announcementContent}>{announcement.description || announcement.content}</p>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noAnnouncementsMessage}>
                            No announcements in the last 2 days.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    welcomeSection: {
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRadius: '10px',
        marginBottom: '30px',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '15px',
    },
    welcomeText: {
        fontSize: '1.2rem',
        color: '#666',
    },
    quickLinksSection: {
        marginBottom: '30px',
    },
    sectionTitle: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '20px',
    },
    quickLinksGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    quickLink: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        },
    },
    announcementsSection: {
        marginTop: '30px',
    },
    announcementsList: {
        display: 'grid',
        gap: '20px',
    },
    announcementCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        borderLeft: '4px solid #FFAE00', // Yellow accent
    },
    announcementTitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '10px',
    },
    announcementDate: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '10px',
        fontStyle: 'italic',
    },
    announcementContent: {
        color: '#444',
    },
    noAnnouncementsMessage: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderLeft: '4px solid #FFAE00', // Yellow accent
    },
    loadingMessage: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    errorMessage: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'red',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderLeft: '4px solid red',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
};

export default Home;
