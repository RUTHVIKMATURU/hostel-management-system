// AnnouncementDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import '../styles/AnnouncementStyles.css';

// Define theme colors - matching with parent component
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    error: '#CF6679',
};

const AnnouncementDetail = () => {
    const API = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncementDetail = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/student-api/announcement/${id}`);
                setAnnouncement(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcement details:', error);
                setError('Failed to load announcement details');
                setLoading(false);
            }
        };

        fetchAnnouncementDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ color: theme.textSecondary, marginTop: '1rem' }}>
                    Loading announcement details...
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

    if (!announcement) {
        return (
            <div className="error-container">
                <AlertCircle size={48} color={theme.error} style={{ marginBottom: '1rem' }} />
                <p style={{ color: theme.text, marginBottom: '1.5rem' }}>Announcement not found</p>
                <button
                    className="back-button"
                    onClick={() => navigate('/announcements/all')}
                >
                    <ArrowLeft size={16} /> Back to Announcements
                </button>
            </div>
        );
    }

    return (
        <div className="announcement-detail-container">
            <div className="announcement-detail-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/announcements/all')}
                >
                    <ArrowLeft size={20} /> Back to Announcements
                </button>
                <h1 className="announcement-detail-title">{announcement.title}</h1>
                <div className="announcement-detail-meta">
                    <div className="announcement-detail-date">
                        <Calendar size={18} color={theme.primary} />
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="announcement-detail-time">
                        <Clock size={18} color={theme.primary} />
                        <span>{new Date(announcement.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            </div>
            <div className="announcement-detail-content">
                {announcement.description}
            </div>
        </div>
    );
};

export default AnnouncementDetail;
