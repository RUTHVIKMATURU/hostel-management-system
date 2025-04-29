import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            console.log('Fetching complaints...');
            const response = await axios.get('/admin-api/get-complaints'); // Updated endpoint
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
            console.log('Updating complaint status:', complaintId, newStatus);
            const response = await axios.put(`/admin-api/mark-complaint-solved/${complaintId}`);
            console.log('Update response:', response.data);
            
            if (response.data.complaint) {
                // Refresh the complaints list
                fetchComplaints();
                // Show success message
                alert('Complaint marked as solved successfully');
            }
        } catch (error) {
            console.error('Error updating status:', error.response?.data || error);
            alert(error.response?.data?.message || 'Failed to update complaint status');
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        if (filter === 'all') return true;
        if (filter === 'active') return complaint.status !== 'solved';
        if (filter === 'solved') return complaint.status === 'solved';
        return true;
    });

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-4" role="alert">
            {error}
        </div>
    );

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
                            All ({complaints.length})
                        </button>
                        <button 
                            className={`btn btn-${filter === 'active' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('active')}
                        >
                            Active ({complaints.filter(c => c.status !== 'solved').length})
                        </button>
                        <button 
                            className={`btn btn-${filter === 'solved' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('solved')}
                        >
                            Solved ({complaints.filter(c => c.status === 'solved').length})
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {complaints.length === 0 ? (
                        <div className="text-center p-4">
                            <p className="mb-0">No complaints found.</p>
                        </div>
                    ) : (
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
                                            <td>{complaint.complaintBy}</td>
                                            <td>
                                                <span className={`badge ${
                                                    complaint.status === 'solved' 
                                                        ? 'bg-success' 
                                                        : 'bg-warning'
                                                }`}>
                                                    {complaint.status || 'active'}
                                                </span>
                                            </td>
                                            <td>
                                                {(!complaint.status || complaint.status !== 'solved') && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintManagement;



