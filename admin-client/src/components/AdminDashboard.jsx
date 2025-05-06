import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Users, AlertCircle, CheckCircle, Clock, FileText, Send, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const [activeStudents, setActiveStudents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, complaintsRes] = await Promise.all([
                axios.get('/admin-api/get-active-students'),
                axios.get('/admin-api/get-complaints')
            ]);

            setActiveStudents(studentsRes.data);
            setComplaints(complaintsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin-api/post-announcement', newAnnouncement);
            setNewAnnouncement({ title: '', description: '' });
            alert('Announcement posted successfully!');
        } catch (error) {
            alert('Failed to post announcement');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">
                        <FileText size={24} color="var(--primary)" />
                        Dashboard Overview
                    </h3>
                    <button
                        className="filter-button"
                        onClick={fetchData}
                    >
                        <RefreshCw size={16} />
                        <span>Refresh Data</span>
                    </button>
                </div>
                <div className="admin-card-body">
                    <div className="stats-grid">
                        <div className="stat-card stat-card-primary">
                            <div className="stat-icon">
                                <Users size={28} />
                            </div>
                            <div className="stat-value">{activeStudents.length}</div>
                            <div className="stat-label">Active Students</div>
                        </div>

                        <div className="stat-card stat-card-warning">
                            <div className="stat-icon">
                                <AlertCircle size={28} color="var(--warning)" />
                            </div>
                            <div className="stat-value">{complaints.filter(c => c.status !== 'solved').length}</div>
                            <div className="stat-label">Open Complaints</div>
                        </div>

                        <div className="stat-card stat-card-success">
                            <div className="stat-icon">
                                <CheckCircle size={28} color="var(--success)" />
                            </div>
                            <div className="stat-value">{complaints.filter(c => c.status === 'solved').length}</div>
                            <div className="stat-label">Resolved Complaints</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Announcement Form */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <Send size={20} color="var(--primary)" />
                            Post Announcement
                        </h3>
                    </div>
                    <div className="admin-card-body">
                        <form onSubmit={handlePostAnnouncement}>
                            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Title</label>
                                <input
                                    type="text"
                                    className="admin-form-control"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>
                            <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
                                <textarea
                                    className="admin-form-control"
                                    rows="4"
                                    value={newAnnouncement.description}
                                    onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                                    placeholder="Enter announcement details"
                                    required
                                    style={{ resize: 'vertical' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="admin-submit-button">
                                <Send size={18} />
                                <span>Post Announcement</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent Complaints Section */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <AlertCircle size={20} color="var(--primary)" />
                            Recent Complaints
                        </h3>
                    </div>
                    <div className="admin-card-body">
                        {complaints.length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <AlertCircle size={32} className="empty-icon" />
                                <p className="empty-text">No complaints found</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {complaints.slice(0, 5).map(complaint => (
                                    <div key={complaint._id} style={{
                                        padding: '1rem',
                                        backgroundColor: 'rgba(0, 191, 166, 0.05)',
                                        borderRadius: 'var(--border-radius)',
                                        borderLeft: '3px solid var(--primary)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h6 style={{
                                                margin: 0,
                                                color: 'var(--text)',
                                                fontWeight: '600',
                                                textTransform: 'capitalize'
                                            }}>{complaint.category}</h6>
                                            <div className={`status-badge ${complaint.status === 'solved' ? 'status-solved' : 'status-active'}`}>
                                                {complaint.status === 'solved' ? (
                                                    <><CheckCircle size={14} /> Solved</>
                                                ) : (
                                                    <><Clock size={14} /> Active</>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem'
                                        }}>{complaint.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
