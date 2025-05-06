import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle, Bell, Calendar, Clock, ChevronRight, RefreshCw, Info, ArrowRight } from 'lucide-react';
import '../HomeStyles.css';

const Home = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
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
                const response = await axios.get('http://localhost:3000/student-api/all-announcements', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('studentToken')}`
                    }
                });

                // Filter announcements from the last 2 days
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

                const recentAnnouncements = response.data.filter(announcement => {
                    const dateField = announcement.createdAt || announcement.dateTime;
                    const announcementDate = new Date(dateField);

                    if (isNaN(announcementDate.getTime())) {
                        return false;
                    }

                    return announcementDate >= twoDaysAgo;
                });

                setRecentAnnouncements(recentAnnouncements);
                setError(null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setError('Failed to load recent announcements. Please try again later.');
                setLoading(false);

                // Try to fetch without authentication as fallback
                try {
                    const fallbackResponse = await axios.get('http://localhost:3000/student-api/all-announcements');
                    if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
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

        // Add animation classes with delay for staggered entrance
        const timer = setTimeout(() => {
            document.querySelector('.welcome-section').classList.add('animate-in');

            setTimeout(() => {
                document.querySelector('.quick-links-section').classList.add('animate-in');

                setTimeout(() => {
                    document.querySelector('.announcements-section').classList.add('animate-in');
                }, 200);
            }, 200);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleQuickLinkClick = (path) => {
        navigate(path);
    };

    const toggleAnnouncementExpand = (id) => {
        setExpandedAnnouncements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const quickLinks = [
        {
            title: 'Outpass',
            description: 'Apply for hostel outpass',
            icon: <LogOut size={24} />,
            path: '/outpass',
            color: '#FF6B6B'
        },
        {
            title: 'Complaints',
            description: 'Register your complaints',
            icon: <AlertTriangle size={24} />,
            path: '/complaints/complaint',
            color: '#4ECDC4'
        },
        {
            title: 'Announcements',
            description: 'View latest updates',
            icon: <Bell size={24} />,
            path: '/announcements/all',
            color: '#FFD166'
        }
    ];

    return (
        <div className="home-container">
            {/* Welcome Section */}
            <section className="welcome-section">
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Welcome, <span className="student-name">{studentInfo?.name || 'Student'}</span>!
                    </h1>
                    <p className="welcome-text">
                        Access all your hostel services and information in one place.
                    </p>
                    <div className="welcome-decoration">
                        <div className="decoration-circle circle-1"></div>
                        <div className="decoration-circle circle-2"></div>
                        <div className="decoration-circle circle-3"></div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="quick-links-section">
                <h2 className="section-title">Quick Links</h2>
                <div className="quick-links-grid">
                    {quickLinks.map((link, index) => (
                        <div
                            key={index}
                            className={`quick-link-card ${activeCard === index ? 'active' : ''}`}
                            onClick={() => handleQuickLinkClick(link.path)}
                            onMouseEnter={() => setActiveCard(index)}
                            onMouseLeave={() => setActiveCard(null)}
                            style={{'--card-color': link.color}}
                        >
                            <div className="quick-link-icon" style={{backgroundColor: `${link.color}20`, color: link.color}}>
                                {link.icon}
                            </div>
                            <h3 className="quick-link-title">{link.title}</h3>
                            <p className="quick-link-description">{link.description}</p>
                            <div className="quick-link-arrow">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Announcements (Last 2 Days) */}
            <section className="announcements-section">
                <h2 className="section-title">Recent Announcements <span className="subtitle">(Last 2 Days)</span></h2>
                <div className="announcements-list">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading announcements...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <AlertTriangle size={24} />
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="retry-button"
                            >
                                <RefreshCw size={16} /> Retry
                            </button>
                        </div>
                    ) : recentAnnouncements.length > 0 ? (
                        recentAnnouncements.map((announcement, index) => (
                            <div key={index} className="announcement-card" style={{'--delay': `${index * 0.1}s`}}>
                                <div className="announcement-header">
                                    <h3 className="announcement-title">{announcement.title}</h3>
                                    <span className="announcement-badge">New</span>
                                </div>
                                <p className="announcement-date">
                                    <Calendar size={14} className="announcement-icon" />
                                    {new Date(announcement.createdAt || announcement.dateTime).toLocaleDateString()}
                                    {" "}
                                    <Clock size={14} className="announcement-icon" />
                                    {new Date(announcement.createdAt || announcement.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <div className={`announcement-content ${expandedAnnouncements[announcement._id] ? 'expanded' : ''}`}>
                                    {announcement.description || announcement.content}
                                </div>
                                <div className="announcement-footer">
                                    <button
                                        className="read-more-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAnnouncementExpand(announcement._id);
                                        }}
                                    >
                                        {expandedAnnouncements[announcement._id] ? 'Show Less' : 'Read More'} <ChevronRight size={16} className={expandedAnnouncements[announcement._id] ? 'rotate-down' : ''} />
                                    </button>
                                    <button
                                        className="view-details-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/announcements/${announcement._id}`);
                                        }}
                                    >
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-container">
                            <Info size={24} />
                            <p>No announcements in the last 2 days.</p>
                            <button
                                onClick={() => navigate('/announcements/all')}
                                className="view-all-button"
                            >
                                View All Announcements
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
