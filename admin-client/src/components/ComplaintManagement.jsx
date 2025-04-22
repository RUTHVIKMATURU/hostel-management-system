import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('/admin-api/complaints');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await axios.put(`/admin-api/update-complaint/${complaintId}`, {
                status: newStatus
            });
            fetchComplaints();
        } catch (error) {
            alert('Failed to update complaint status');
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        if (filter === 'all') return true;
        if (filter === 'active') return complaint.status !== 'solved';
        if (filter === 'solved') return complaint.status === 'solved';
        return true;
    });

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Complaint Management</h4>
                    <div className="btn-group">
                        <button 
                            className={`btn btn-${filter === 'all' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`btn btn-${filter === 'active' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('active')}
                        >
                            Active
                        </button>
                        <button 
                            className={`btn btn-${filter === 'solved' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('solved')}
                        >
                            Solved
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
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
                                        <td>{complaint.category}</td>
                                        <td>{complaint.description}</td>
                                        <td>{complaint.studentName}</td>
                                        <td>
                                            <span className={`badge ${
                                                complaint.status === 'solved' 
                                                    ? 'bg-success' 
                                                    : 'bg-warning'
                                            }`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td>
                                            {complaint.status !== 'solved' && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleStatusUpdate(complaint._id, 'solved')}
                                                >
                                                    Mark as Solved
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintManagement;
