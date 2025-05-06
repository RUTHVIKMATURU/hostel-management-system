import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useUser } from '../context/UserContext';
import { AlertTriangle, RefreshCw, FileText, Clock, Calendar, Home, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const OutpassList = ({ searchQuery = '' }) => {
    const { user } = useUser();
    const [outpasses, setOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOutpasses = async () => {
            if (!user?.rollNumber) {
                setError('User information not available');
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/student-api/all-outpasses/${user.rollNumber}`);

                if (response.data && response.data.studentOutpasses) {
                    // Sort outpasses by date (newest first)
                    const sortedOutpasses = response.data.studentOutpasses.sort((a, b) => {
                        return new Date(b.outTime) - new Date(a.outTime);
                    });
                    setOutpasses(sortedOutpasses);
                } else {
                    setOutpasses([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching outpasses:', err);
                setError(err.response?.data?.message || 'Failed to fetch outpasses');
                setOutpasses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOutpasses();
    }, [user?.rollNumber]);

    // Filter outpasses based on search query
    const filteredOutpasses = outpasses.filter(outpass => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            outpass.reason?.toLowerCase().includes(query) ||
            outpass.type?.toLowerCase().includes(query) ||
            outpass.status?.toLowerCase().includes(query)
        );
    });

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock size={16} />;
            case 'accepted':
                return <CheckCircle size={16} />;
            case 'rejected':
                return <XCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'accepted':
                return 'status-accepted';
            case 'rejected':
                return 'status-rejected';
            default:
                return '';
        }
    };

    const getTypeIcon = (type) => {
        switch ((type || '').toLowerCase()) {
            case 'late pass':
                return <Clock size={16} />;
            case 'home pass':
                return <Home size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    const getTypeClass = (type) => {
        switch ((type || '').toLowerCase()) {
            case 'late pass':
                return 'type-late';
            case 'home pass':
                return 'type-home';
            default:
                return '';
        }
    };

    if (!user) {
        return (
            <div className="empty-state">
                <AlertTriangle size={48} className="empty-icon" />
                <h3 className="empty-title">Authentication Required</h3>
                <p className="empty-text">Please log in to view your outpass history</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading outpass history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state">
                <AlertTriangle size={48} className="empty-icon" style={{ color: 'var(--error)' }} />
                <h3 className="empty-title" style={{ color: 'var(--error)' }}>Error</h3>
                <p className="empty-text">{error}</p>
                <button
                    className="submit-button"
                    style={{ maxWidth: '200px' }}
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    if (filteredOutpasses.length === 0) {
        return (
            <div className="empty-state">
                <FileText size={48} className="empty-icon" />
                <h3 className="empty-title">No Outpass Requests Found</h3>
                {searchQuery ? (
                    <p className="empty-text">No outpass requests match your search for "{searchQuery}"</p>
                ) : (
                    <p className="empty-text">Your outpass history will appear here once you submit requests</p>
                )}
            </div>
        );
    }

    return (
        <div className="outpass-list">
            <div className="list-header">
                <h3 className="list-title">My Outpass Requests</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Showing {filteredOutpasses.length} {filteredOutpasses.length === 1 ? 'request' : 'requests'}
                </div>
            </div>

            <table className="outpass-table">
                <thead>
                    <tr>
                        <th>Out Time</th>
                        <th>In Time</th>
                        <th>Reason</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOutpasses.map((outpass) => (
                        <tr key={outpass._id}>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{new Date(outpass.outTime).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{new Date(outpass.outTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{new Date(outpass.inTime).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{new Date(outpass.inTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{outpass.reason}</td>
                            <td>
                                <div className={`type-badge ${getTypeClass(outpass.type)}`}>
                                    {getTypeIcon(outpass.type)}
                                    <span style={{ textTransform: 'capitalize' }}>{outpass.type}</span>
                                </div>
                            </td>
                            <td>
                                <div className={`status-badge ${getStatusClass(outpass.status)}`}>
                                    {getStatusIcon(outpass.status)}
                                    <span>{outpass.status}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OutpassList;
