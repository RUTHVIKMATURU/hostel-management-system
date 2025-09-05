import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { AlertTriangle, RefreshCw, FileText, Clock, Calendar, CheckCircle, AlertCircle, XCircle, MessageSquare } from 'lucide-react';

const ComplaintsList = ({ searchQuery = '' }) => {
    const { user } = useUser();
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh
    const API = import.meta.env.VITE_API_URL;

    // Force refresh when navigated with refresh state
    useEffect(() => {
        if (location.state?.refresh) {
            setRefreshKey(prev => prev + 1);
            // Clear the state to prevent infinite refreshes
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!user || !user.rollNumber) {
                setLoading(false);
                return;
            }

            try {
                // Add cache-busting parameter to prevent caching
                const timestamp = new Date().getTime();
                const response = await axiosInstance.get(
                    `${API}/student-api/get-complaints/${user.rollNumber}?_=${timestamp}`
                );

                if (Array.isArray(response.data)) {
                    // Sort complaints by date (newest first)
                    const sortedComplaints = response.data.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    setComplaints(sortedComplaints);
                } else {
                    console.error('Expected array but got:', typeof response.data);
                    setComplaints([]);
                }
            } catch (err) {
                console.error('Error fetching complaints:', err);
                setError(`Failed to fetch complaints: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [user?.rollNumber, refreshKey]); // Add refreshKey to dependencies

    // Filter complaints based on search query
    const filteredComplaints = complaints.filter(complaint => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            complaint.category?.toLowerCase().includes(query) ||
            complaint.description?.toLowerCase().includes(query) ||
            complaint.status?.toLowerCase().includes(query)
        );
    });

    const getStatusIcon = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'active':
                return <AlertCircle size={16} />;
            case 'solved':
                return <CheckCircle size={16} />;
            case 'pending':
                return <Clock size={16} />;
            case 'rejected':
                return <XCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const getStatusClass = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'active':
                return 'status-active';
            case 'solved':
                return 'status-solved';
            case 'pending':
                return 'status-pending';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-active';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading complaint history...</p>
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

    if (!complaints || filteredComplaints.length === 0) {
        return (
            <div className="empty-state">
                <FileText size={48} className="empty-icon" />
                <h3 className="empty-title">No Complaints Found</h3>
                {searchQuery ? (
                    <p className="empty-text">No complaints match your search for "{searchQuery}"</p>
                ) : (
                    <p className="empty-text">Your complaint history will appear here once you submit complaints</p>
                )}
            </div>
        );
    }

    return (
        <div className="complaints-list">
            <div className="list-header">
                <h3 className="list-title">My Complaints</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Showing {filteredComplaints.length} {filteredComplaints.length === 1 ? 'complaint' : 'complaints'}
                </div>
            </div>

            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Admin Reply</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredComplaints.map((complaint, index) => (
                        <tr key={complaint._id || index}>
                            <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                            <td>{complaint.description}</td>
                            <td>
                                <div className={`status-badge ${getStatusClass(complaint.status)}`}>
                                    {getStatusIcon(complaint.status)}
                                    <span>{complaint.status ? complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1) : 'Active'}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={14} style={{ color: 'var(--primary)' }} />
                                        <span>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unknown time'}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {complaint.adminReply ? (
                                    <div className="admin-reply">
                                        <div className="admin-reply-header">
                                            <MessageSquare size={14} />
                                            <span>Admin Response:</span>
                                        </div>
                                        <div className="admin-reply-content">
                                            {complaint.adminReply}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="no-reply">No reply yet</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'pending': return { color: '#E59D00', backgroundColor: '#FFF9E6' }; // Yellow for pending
        case 'active': return { color: '#E59D00', backgroundColor: '#FFF9E6' }; // Yellow for active
        case 'solved': return { color: '#4CAF50', backgroundColor: '#E8F5E9' }; // Green for solved
        case 'rejected': return { color: '#FF0000', backgroundColor: '#FFEBEE' }; // Red for rejected
        default: return { color: '#000', backgroundColor: '#F0F0F0' };
    }
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        background: '#FFF',
        borderTop: '5px solid #FFAE00',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#E59D00',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px',
        backgroundColor: '#FFAE00',
        color: '#FFF',
        textAlign: 'left',
        fontWeight: '600',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid #FFE082',
    },
    row: {
        transition: 'background-color 0.2s',
    }
};

export default ComplaintsList;
