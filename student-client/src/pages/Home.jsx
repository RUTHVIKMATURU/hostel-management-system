import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);

    useEffect(() => {
        // Get student info from localStorage
        const storedInfo = localStorage.getItem('studentInfo');
        if (storedInfo) {
            setStudentInfo(JSON.parse(storedInfo));
        }

        // Fetch recent announcements
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('http://localhost:4000/student-api/all-announcements', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('studentToken')}`
                    }
                });
                setRecentAnnouncements(response.data.slice(0, 3)); // Get latest 3 announcements
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);

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
                    <div style={styles.quickLink}>
                        <h3>Outpass</h3>
                        <p>Apply for hostel outpass</p>
                    </div>
                    <div style={styles.quickLink}>
                        <h3>Complaints</h3>
                        <p>Register your complaints</p>
                    </div>
                    <div style={styles.quickLink}>
                        <h3>Announcements</h3>
                        <p>View latest updates</p>
                    </div>
                </div>
            </section>

            {/* Recent Announcements */}
            <section style={styles.announcementsSection}>
                <h2 style={styles.sectionTitle}>Recent Announcements</h2>
                <div style={styles.announcementsList}>
                    {recentAnnouncements.map((announcement, index) => (
                        <div key={index} style={styles.announcementCard}>
                            <h3 style={styles.announcementTitle}>{announcement.title}</h3>
                            <p style={styles.announcementDate}>
                                {new Date(announcement.date).toLocaleDateString()}
                            </p>
                            <p style={styles.announcementContent}>{announcement.content}</p>
                        </div>
                    ))}
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
        transition: 'transform 0.2s',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-5px)',
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
    },
    announcementContent: {
        color: '#444',
    },
};

export default Home;
