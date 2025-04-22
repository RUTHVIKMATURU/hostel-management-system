import { useState, useEffect } from 'react';
import axios from '../utils/axios';

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
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Dashboard Overview</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card bg-info text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Active Students</h5>
                                            <h2>{activeStudents.length}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Open Complaints</h5>
                                            <h2>{complaints.filter(c => c.status !== 'solved').length}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-success text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Resolved Complaints</h5>
                                            <h2>{complaints.filter(c => c.status === 'solved').length}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Announcement Section */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Post New Announcement</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handlePostAnnouncement}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Announcement Title"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement({
                                            ...newAnnouncement,
                                            title: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Announcement Description"
                                        value={newAnnouncement.description}
                                        onChange={(e) => setNewAnnouncement({
                                            ...newAnnouncement,
                                            description: e.target.value
                                        })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Post Announcement
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Recent Complaints Section */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Recent Complaints</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                {complaints.slice(0, 5).map(complaint => (
                                    <div key={complaint._id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="mb-1">{complaint.category}</h6>
                                            <span className={`badge ${complaint.status === 'solved' ? 'bg-success' : 'bg-warning'}`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="mb-1">{complaint.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
