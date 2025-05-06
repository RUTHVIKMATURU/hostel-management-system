import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { AlertCircle, CheckCircle, XCircle, Search, Filter, RefreshCw, MessageSquare, Send } from 'lucide-react';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            console.log('Fetching complaints...');
            const response = await axios.get('/admin-api/get-complaints');
            console.log('Complaints response:', response.data);
            setComplaints(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setError('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            setSelectedComplaintId(complaintId);
            setIsSubmitting(true);

            const response = await axios.put(`/admin-api/mark-complaint-solved/${complaintId}`, {
                adminReply: replyMessage || undefined
            });

            if (response.data.complaint) {
                // Refresh the complaints list
                fetchComplaints();
                // Reset the reply message
                setReplyMessage('');
                setSelectedComplaintId(null);
            }
        } catch (error) {
            console.error('Error updating status:', error.response?.data || error);
            alert(error.response?.data?.message || 'Failed to update complaint status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (complaintId) => {
        if (!replyMessage.trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.put(`/admin-api/reply-to-complaint/${complaintId}`, {
                adminReply: replyMessage
            });

            if (response.data.success) {
                // Refresh the complaints list
                fetchComplaints();
                // Reset the reply message
                setReplyMessage('');
                setSelectedComplaintId(null);
            }
        } catch (error) {
            console.error('Error replying to complaint:', error);
            alert('Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        // First apply status filter
        let statusMatch = true;
        if (filter === 'active') statusMatch = complaint.status !== 'solved';
        if (filter === 'solved') statusMatch = complaint.status === 'solved';

        // Then apply search filter if there's a search query
        if (!searchQuery) return statusMatch;

        const query = searchQuery.toLowerCase();
        const searchMatch =
            complaint.category?.toLowerCase().includes(query) ||
            complaint.description?.toLowerCase().includes(query) ||
            complaint.complaintBy?.toLowerCase().includes(query);

        return statusMatch && searchMatch;
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading complaints...</p>
        </div>
    );

    if (error) return (
        <div className="empty-state">
            <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--error)' }} />
            <h3 className="empty-title" style={{ color: 'var(--error)' }}>Error</h3>
            <p className="empty-text">{error}</p>
            <button
                className="admin-submit-button"
                style={{ maxWidth: '200px' }}
                onClick={fetchComplaints}
            >
                <RefreshCw size={18} />
                <span>Try Again</span>
            </button>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">
                        <AlertCircle size={24} color="var(--primary)" />
                        Complaint Management
                    </h3>

                    <div className="filter-buttons">
                        <button
                            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <Filter size={16} />
                            All ({complaints.length})
                        </button>
                        <button
                            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
                            onClick={() => setFilter('active')}
                        >
                            <AlertCircle size={16} />
                            Active ({complaints.filter(c => c.status !== 'solved').length})
                        </button>
                        <button
                            className={`filter-button ${filter === 'solved' ? 'active' : ''}`}
                            onClick={() => setFilter('solved')}
                        >
                            <CheckCircle size={16} />
                            Solved ({complaints.filter(c => c.status === 'solved').length})
                        </button>
                        <button
                            className="filter-button"
                            onClick={fetchComplaints}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="admin-card-body">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <Search size={18} className="search-icon" />
                    </div>

                    {complaints.length === 0 ? (
                        <div className="empty-state">
                            <AlertCircle size={48} className="empty-icon" />
                            <h3 className="empty-title">No Complaints Found</h3>
                            <p className="empty-text">There are no complaints in the system yet.</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="empty-state">
                            <Search size={48} className="empty-icon" />
                            <h3 className="empty-title">No Matching Complaints</h3>
                            <p className="empty-text">No complaints match your current filters.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Student</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map(complaint => (
                                        <tr key={complaint._id}>
                                            <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                                            <td>{complaint.description}</td>
                                            <td>{complaint.complaintBy}</td>
                                            <td>
                                                <div className={`status-badge ${
                                                    complaint.status === 'solved'
                                                        ? 'status-solved'
                                                        : 'status-active'
                                                }`}>
                                                    {complaint.status === 'solved' ? (
                                                        <><CheckCircle size={14} /> Solved</>
                                                    ) : (
                                                        <><AlertCircle size={14} /> Active</>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons-container">
                                                    {complaint.adminReply && (
                                                        <div className="admin-reply-badge">
                                                            <MessageSquare size={14} />
                                                            <span>{complaint.adminReply}</span>
                                                        </div>
                                                    )}

                                                    {selectedComplaintId === complaint._id ? (
                                                        <div className="admin-reply-form">
                                                            <textarea
                                                                className="admin-form-control"
                                                                placeholder="Enter reply message..."
                                                                value={replyMessage}
                                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                                rows={3}
                                                            />
                                                            <div className="admin-reply-actions">
                                                                <button
                                                                    className="action-button"
                                                                    onClick={() => {
                                                                        setSelectedComplaintId(null);
                                                                        setReplyMessage('');
                                                                    }}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>

                                                                {!complaint.status || complaint.status !== 'solved' ? (
                                                                    <button
                                                                        className="action-button action-button-approve"
                                                                        onClick={() => handleStatusUpdate(complaint._id, 'solved')}
                                                                        disabled={isSubmitting}
                                                                        title="Mark as Solved with Reply"
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <div className="button-spinner small"></div>
                                                                        ) : (
                                                                            <CheckCircle size={18} />
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="action-button action-button-approve"
                                                                        onClick={() => handleReply(complaint._id)}
                                                                        disabled={isSubmitting || !replyMessage.trim()}
                                                                        title="Send Reply"
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <div className="button-spinner small"></div>
                                                                        ) : (
                                                                            <Send size={18} />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="action-button"
                                                                onClick={() => setSelectedComplaintId(complaint._id)}
                                                                title="Reply to Complaint"
                                                            >
                                                                <MessageSquare size={18} />
                                                            </button>

                                                            {(!complaint.status || complaint.status !== 'solved') && (
                                                                <button
                                                                    className="action-button action-button-approve"
                                                                    onClick={() => handleStatusUpdate(complaint._id, 'solved')}
                                                                    title="Mark as Solved"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintManagement;



