// AllAnnouncements.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, AlertCircle, RefreshCw, Info, ChevronRight, Archive, ArrowRight } from 'lucide-react';
import '../styles/AnnouncementStyles.css';

// Define theme colors - matching with parent component
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
};

const AllAnnouncements = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 announcements
    const [expandedAnnouncements, setExpandedAnnouncements] = useState({});

    useEffect(() => {
        const fetchAllAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/student-api/all-announcements');

                // Sort announcements by date (newest first)
                const sortedAnnouncements = response.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setAllAnnouncements(sortedAnnouncements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all announcements:', error);
                setError('Failed to load announcements');
                setLoading(false);
            }
        };

        fetchAllAnnouncements();
    }, []);

    // Filter announcements based on search query
    const filteredAnnouncements = allAnnouncements.filter(announcement => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            announcement.title?.toLowerCase().includes(query) ||
            announcement.description?.toLowerCase().includes(query)
        );
    });

    // Load more announcements
    const loadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    // Toggle announcement expand/collapse
    const toggleAnnouncementExpand = (id) => {
        setExpandedAnnouncements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Group announcements by month
    const groupedAnnouncements = filteredAnnouncements.reduce((groups, announcement) => {
        const date = new Date(announcement.createdAt);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }

        groups[monthYear].push(announcement);
        return groups;
    }, {});

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ color: theme.textSecondary, marginTop: '1rem' }}>
                    Loading all announcements...
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
                <Archive size={48} style={{ color: theme.textSecondary, marginBottom: '1rem', opacity: 0.5 }} />
                {searchQuery ? (
                    <p style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
                        No announcements found matching "{searchQuery}".
                    </p>
                ) : (
                    <p style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
                        No announcements available.
                    </p>
                )}
            </div>
        );
    }

    // Get visible announcements
    const visibleAnnouncements = filteredAnnouncements.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAnnouncements.length;

    return (
        <div>
            {/* Timeline view of announcements */}
            {Object.entries(groupedAnnouncements).map(([monthYear, announcements], groupIndex) => (
                <div key={monthYear} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        position: 'relative',
                    }}>
                        <div style={{
                            backgroundColor: theme.primary,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginRight: '1rem',
                            boxShadow: '0 0 0 4px rgba(108, 99, 255, 0.2)',
                        }}></div>
                        <h3 style={{
                            color: theme.text,
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: 0,
                        }}>{monthYear}</h3>
                        <div style={{
                            position: 'absolute',
                            left: '6px',
                            top: '24px',
                            bottom: '-32px',
                            width: '2px',
                            backgroundColor: 'rgba(108, 99, 255, 0.2)',
                            display: groupIndex === Object.keys(groupedAnnouncements).length - 1 ? 'none' : 'block',
                        }}></div>
                    </div>

                    <div style={{ marginLeft: '2rem' }}>
                        {announcements.slice(0, visibleCount).map((announcement, index) => (
                            <div
                                key={announcement._id || index}
                                className="announcement-card"
                                style={{ '--delay': index }}
                            >
                                <div className="announcement-header">
                                    <h3 className="announcement-title">{announcement.title}</h3>
                                    {/* Show "New" badge for announcements less than 3 days old */}
                                    {(new Date() - new Date(announcement.createdAt)) / (1000 * 60 * 60 * 24) < 3 && (
                                        <div className="announcement-badge">
                                            <span>New</span>
                                        </div>
                                    )}
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
                </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem',
                    marginBottom: '1rem'
                }}>
                    <button
                        onClick={loadMore}
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.primary,
                            border: `1px solid ${theme.primary}`,
                            borderRadius: '50px',
                            padding: '0.75rem 2rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllAnnouncements;