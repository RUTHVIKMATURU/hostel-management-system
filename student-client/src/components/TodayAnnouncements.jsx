// TodayAnnouncements.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, AlertCircle, RefreshCw, Info, ChevronRight, ArrowRight } from 'lucide-react';
import '../styles/AnnouncementStyles.css';

// Define theme colors - matching with parent component
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
};

const TodayAnnouncements = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const [todayAnnouncements, setTodayAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTodayAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/student-api/announcements`);
                setTodayAnnouncements(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching today\'s announcements:', error);
                setError('Failed to load today\'s announcements');
                setLoading(false);
            }
        };

        fetchTodayAnnouncements();
    }, []);

    // Toggle announcement expand/collapse
    const toggleAnnouncementExpand = (id) => {
        setExpandedAnnouncements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filter announcements based on search query
    const filteredAnnouncements = todayAnnouncements.filter(announcement => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            announcement.title?.toLowerCase().includes(query) ||
            announcement.description?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ color: theme.textSecondary, marginTop: '1rem' }}>
                    Loading today's announcements...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertCircle size={48} color={theme.error} style={{ marginBottom: '1rem' }} />
                <p style={{ color: theme.text, marginBottom: '1.5rem' }}>{error}</p>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );
    }

    if (filteredAnnouncements.length === 0) {
        return (
            <div className="empty-container">
                <Info size={48} style={{ color: theme.textSecondary, marginBottom: '1rem', opacity: 0.5 }} />
                {searchQuery ? (
                    <p style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
                        No announcements found matching "{searchQuery}".
                    </p>
                ) : (
                    <p style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
                        No announcements for today.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            {filteredAnnouncements.map((announcement, index) => (
                <div
                    key={announcement._id || index}
                    className="announcement-card"
                    style={{ '--delay': index }}
                >
                    <div className="announcement-header">
                        <h3 className="announcement-title">{announcement.title}</h3>
                        <div className="announcement-badge">
                            <span>New</span>
                        </div>
                    </div>

                    <div className="announcement-date">
                        <Calendar size={16} color={theme.primary} />
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        <Clock size={16} color={theme.primary} />
                        <span>{new Date(announcement.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    <div className={`announcement-content ${expandedAnnouncements[announcement._id] ? 'expanded' : ''}`}>
                        {announcement.description}
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
            ))}
        </div>
    );
};

export default TodayAnnouncements;