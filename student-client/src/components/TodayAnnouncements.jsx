// TodayAnnouncements.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const TodayAnnouncements = () => {
    const [todayAnnouncements, setTodayAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/student-api/announcements');
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

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

    return (
        <div>
            {todayAnnouncements.length > 0 ? (
                todayAnnouncements.map((announcement) => (
                    <div key={announcement._id} className="card mb-3" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div className="card-body">
                            <h5 className="card-title">{announcement.title}</h5>
                            <p className="card-text">{announcement.description}</p>
                            <small style={{ color: '#6c757d' }}>
                                Posted at: {new Date(announcement.createdAt).toLocaleString()}
                            </small>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: '#6c757d', textAlign: 'center' }}>No announcements for today.</p>
            )}
        </div>
    );
};

export default TodayAnnouncements;