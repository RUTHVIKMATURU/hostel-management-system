import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [remarks, setRemarks] = useState('');
    const [activeTab, setActiveTab] = useState('outpass'); // 'outpass' or 'complaints'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching complaints and requests...');
            const [requestsResponse, complaintsResponse] = await Promise.all([
                axios.get('/admin-api/requests'),
                axios.get('/admin-api/get-complaints')  // Make sure this matches your backend endpoint
            ]);
            console.log('Complaints response:', complaintsResponse.data);
            console.log('Requests response:', requestsResponse.data);
            setRequests(requestsResponse.data);
            setComplaints(complaintsResponse.data);
        } catch (error) {
            console.error('Error details:', error.response?.data);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, type) => {
        try {
            if (type === 'outpass') {
                await axios.put(`/admin-api/requests/${id}`, {
                    status: newStatus,
                    remarks: remarks
                });
            } else {
                await axios.put(`/admin-api/update-complaint/${id}`, {
                    status: newStatus
                });
            }
            fetchData();
            setRemarks('');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredItems = (type) => {
        const items = type === 'outpass' ? requests : complaints;
        if (filter === 'all') return items;
        return items.filter(item => item.status === filter);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'solved': return 'bg-success';
            default: return 'bg-warning';
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Request Management</h4>
                        <div className="btn-group">
                            <button 
                                className={`btn btn-${activeTab === 'outpass' ? 'light' : 'primary'}`}
                                onClick={() => setActiveTab('outpass')}
                            >
                                Outpass Requests
                            </button>
                            <button 
                                className={`btn btn-${activeTab === 'complaints' ? 'light' : 'primary'}`}
                                onClick={() => setActiveTab('complaints')}
                            >
                                Complaints
                            </button>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button 
                            className={`btn btn-${filter === 'all' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`btn btn-${filter === 'pending' ? 'light' : 'primary'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button 
                            className={`btn btn-${filter === 'approved' ? 'light' : 'primary'}`}
                            onClick={() => setFilter(activeTab === 'outpass' ? 'approved' : 'solved')}
                        >
                            {activeTab === 'outpass' ? 'Approved' : 'Solved'}
                        </button>
                        {activeTab === 'outpass' && (
                            <button 
                                className={`btn btn-${filter === 'rejected' ? 'light' : 'primary'}`}
                                onClick={() => setFilter('rejected')}
                            >
                                Rejected
                            </button>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        {activeTab === 'outpass' ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Roll Number</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems('outpass').map(request => (
                                        <tr key={request._id}>
                                            <td>{request.name}</td>
                                            <td>{request.rollNumber}</td>
                                            <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                                            <td>{new Date(request.toDate).toLocaleDateString()}</td>
                                            <td>{request.reason}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>
                                                {request.status === 'pending' && (
                                                    <div className="d-flex gap-2">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            placeholder="Add remarks"
                                                            value={remarks}
                                                            onChange={(e) => setRemarks(e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleStatusUpdate(request._id, 'approved', 'outpass')}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleStatusUpdate(request._id, 'rejected', 'outpass')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {request.remarks && (
                                                    <div className="small text-muted mt-1">
                                                        Remarks: {request.remarks}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Student Roll No</th>
                                        <th>Status</th>
                                        <th>Submitted On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems('complaints').map(complaint => (
                                        <tr key={complaint._id}>
                                            <td>{complaint.category}</td>
                                            <td>{complaint.description}</td>
                                            <td>{complaint.complaintBy}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td>{new Date(complaint.createdAt).toLocaleString()}</td>
                                            <td>
                                                {complaint.status === 'active' && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleStatusUpdate(complaint._id, 'solved', 'complaint')}
                                                    >
                                                        Mark as Solved
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestManagement;


