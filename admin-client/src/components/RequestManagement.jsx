import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [remarks, setRemarks] = useState('');
    const [activeTab, setActiveTab] = useState('outpass');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filter]); // Re-fetch when filter changes

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching outpass requests...');
            
            // For debugging - fetch and display all available endpoints
            try {
                const debugResponse = await axios.get('/admin-api');
                console.log('Debug API response:', debugResponse);
                setDebugInfo(debugResponse.data);
            } catch (debugError) {
                console.log('Debug endpoint not available:', debugError);
            }
            
            // Try all possible endpoints for outpasses
            const endpoints = [
                '/admin-api/requests',
                '/admin-api/pending-outpasses',
                '/admin-api/all-outpasses'
            ];
            
            let allOutpasses = [];
            let successfulEndpoint = null;
            
            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying endpoint: ${endpoint}`);
                    const response = await axios.get(endpoint);
                    console.log(`Response from ${endpoint}:`, response);
                    
                    if (response.data) {
                        if (Array.isArray(response.data)) {
                            allOutpasses = response.data;
                            successfulEndpoint = endpoint;
                            break;
                        } else if (response.data.pendingOutpasses && Array.isArray(response.data.pendingOutpasses)) {
                            allOutpasses = response.data.pendingOutpasses;
                            successfulEndpoint = endpoint;
                            break;
                        } else if (response.data.outpasses && Array.isArray(response.data.outpasses)) {
                            allOutpasses = response.data.outpasses;
                            successfulEndpoint = endpoint;
                            break;
                        }
                    }
                } catch (endpointError) {
                    console.log(`Error with endpoint ${endpoint}:`, endpointError);
                }
            }
            
            console.log(`Successfully fetched data from: ${successfulEndpoint}`);
            console.log('Outpasses data:', allOutpasses);
            
            if (allOutpasses.length === 0) {
                // If we couldn't get data from any endpoint, try a custom approach
                try {
                    console.log('Trying custom approach to get all outpasses...');
                    
                    // First get pending outpasses
                    const pendingResponse = await axios.get('/admin-api/pending-outpasses');
                    let pendingOutpasses = [];
                    
                    if (pendingResponse.data && pendingResponse.data.pendingOutpasses) {
                        pendingOutpasses = pendingResponse.data.pendingOutpasses;
                    } else if (Array.isArray(pendingResponse.data)) {
                        pendingOutpasses = pendingResponse.data;
                    }
                    
                    // Then try to get all outpasses from student API
                    const allStudentsResponse = await axios.get('/admin-api/students');
                    const students = allStudentsResponse.data.students || [];
                    
                    // For each student, try to get their outpasses
                    const studentOutpasses = [];
                    for (const student of students.slice(0, 5)) { // Limit to first 5 students to avoid too many requests
                        try {
                            const studentOutpassResponse = await axios.get(`/student-api/all-outpasses/${student.rollNumber}`);
                            if (studentOutpassResponse.data && studentOutpassResponse.data.studentOutpasses) {
                                studentOutpasses.push(...studentOutpassResponse.data.studentOutpasses);
                            }
                        } catch (error) {
                            console.log(`Error fetching outpasses for student ${student.rollNumber}:`, error);
                        }
                    }
                    
                    // Combine all outpasses
                    allOutpasses = [...pendingOutpasses, ...studentOutpasses];
                    
                    // Remove duplicates
                    const uniqueOutpasses = [];
                    const ids = new Set();
                    for (const outpass of allOutpasses) {
                        if (!ids.has(outpass._id)) {
                            ids.add(outpass._id);
                            uniqueOutpasses.push(outpass);
                        }
                    }
                    
                    allOutpasses = uniqueOutpasses;
                    console.log('Combined outpasses from multiple sources:', allOutpasses);
                } catch (customError) {
                    console.error('Custom approach failed:', customError);
                }
            }
            
            setRequests(allOutpasses);
            setError(null);
        } catch (error) {
            console.error('General error in fetchData:', error);
            setError('Failed to fetch data. Please try again later.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, type) => {
        try {
            setSelectedRequestId(id);
            
            // Map UI status to API status
            const apiStatus = newStatus === 'approved' ? 'accepted' : newStatus;
            
            console.log(`Updating outpass ${id} to status: ${apiStatus}`);
            
            // Try multiple endpoints
            const updateEndpoints = [
                { url: `/admin-api/requests/${id}`, method: 'put', data: { status: apiStatus, remarks } },
                { url: `/admin-api/update-outpass-status/${id}`, method: 'put', data: { status: apiStatus, remarks } }
            ];
            
            let updateSuccess = false;
            
            for (const endpoint of updateEndpoints) {
                try {
                    console.log(`Trying to update using endpoint: ${endpoint.url}`);
                    const response = await axios[endpoint.method](endpoint.url, endpoint.data);
                    console.log(`Update response from ${endpoint.url}:`, response);
                    updateSuccess = true;
                    break;
                } catch (endpointError) {
                    console.log(`Error with update endpoint ${endpoint.url}:`, endpointError);
                }
            }
            
            if (!updateSuccess) {
                throw new Error('All update endpoints failed');
            }
            
            // Update the local state to reflect the change immediately
            setRequests(prevRequests => 
                prevRequests.map(req => 
                    req._id === id ? { ...req, status: apiStatus, remarks } : req
                )
            );
            
            alert(`Outpass request ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
            
            // Refresh data to ensure we have the latest state
            setTimeout(() => {
                fetchData();
            }, 1000);
            
            setRemarks('');
            setSelectedRequestId(null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
            setSelectedRequestId(null);
        }
    };

    const filteredItems = () => {
        if (!requests || !Array.isArray(requests)) return [];
        
        console.log('Filtering items with filter:', filter);
        console.log('Available items:', requests);
        
        if (filter === 'all') return requests;
        
        // Log all statuses for debugging
        const statuses = requests.map(req => req.status);
        console.log('All statuses in data:', statuses);
        
        if (filter === 'approved') {
            const approvedItems = requests.filter(item => 
                item.status === 'approved' || 
                item.status === 'accepted'
            );
            console.log('Approved items:', approvedItems);
            return approvedItems;
        } else if (filter === 'pending') {
            return requests.filter(item => item.status === 'pending');
        } else if (filter === 'rejected') {
            return requests.filter(item => item.status === 'rejected');
        }
        
        return requests;
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'accepted': return 'bg-success';
            case 'rejected': return 'bg-danger';
            default: return 'bg-warning';
        }
    };

    const getStatusDisplayText = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'Approved';
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            case 'pending': return 'Pending';
            default: return status || 'Unknown';
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const filtered = filteredItems();

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#FFAE00', color: 'white' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Outpass Requests</h4>
                        <button 
                            className="btn btn-sm btn-light" 
                            onClick={fetchData}
                            title="Refresh data"
                        >
                            <i className="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                    <div className="btn-group">
                        <button 
                            className={`btn ${filter === 'all' ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({requests.length})
                        </button>
                        <button 
                            className={`btn ${filter === 'pending' ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending ({requests.filter(r => r.status === 'pending').length})
                        </button>
                        <button 
                            className={`btn ${filter === 'approved' ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setFilter('approved')}
                        >
                            Approved ({requests.filter(r => r.status === 'approved' || r.status === 'accepted').length})
                        </button>
                        <button 
                            className={`btn ${filter === 'rejected' ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected ({requests.filter(r => r.status === 'rejected').length})
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger d-flex justify-content-between align-items-center">
                            <span>{error}</span>
                            <button className="btn btn-sm btn-outline-danger" onClick={fetchData}>
                                Retry
                            </button>
                        </div>
                    )}
                    
                    
                    <div className="table-responsive">
                        {filtered.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Roll Number</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Type</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(request => (
                                        <tr key={request._id}>
                                            <td>{request.name}</td>
                                            <td>{request.rollNumber}</td>
                                            <td>{new Date(request.outTime || request.fromDate).toLocaleDateString()} {new Date(request.outTime || request.fromDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                            <td>{new Date(request.inTime || request.toDate).toLocaleDateString()} {new Date(request.inTime || request.toDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                            <td>{request.type || 'N/A'}</td>
                                            <td>{request.reason}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                                                    {getStatusDisplayText(request.status)}
                                                </span>
                                            </td>
                                            <td>
                                                {(request.status === 'pending') && (
                                                    <div className="d-flex flex-column gap-2">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            placeholder="Add remarks"
                                                            value={selectedRequestId === request._id ? remarks : ''}
                                                            onChange={(e) => setRemarks(e.target.value)}
                                                            style={{ borderColor: '#FFE082' }}
                                                        />
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm"
                                                                style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                                                onClick={() => handleStatusUpdate(request._id, 'approved', 'outpass')}
                                                                disabled={selectedRequestId !== null && selectedRequestId !== request._id}
                                                            >
                                                                {selectedRequestId === request._id ? 'Processing...' : 'Approve'}
                                                            </button>
                                                            <button
                                                                className="btn btn-sm"
                                                                style={{ backgroundColor: '#F44336', color: 'white' }}
                                                                onClick={() => handleStatusUpdate(request._id, 'rejected', 'outpass')}
                                                                disabled={selectedRequestId !== null && selectedRequestId !== request._id}
                                                            >
                                                                {selectedRequestId === request._id ? 'Processing...' : 'Reject'}
                                                            </button>
                                                        </div>
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
                            <div className="alert alert-info">
                                No outpass requests found with status: {filter}. 
                                {filter !== 'all' && (
                                    <button 
                                        className="btn btn-link p-0 ms-2"
                                        onClick={() => setFilter('all')}
                                    >
                                        Show all requests
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestManagement;


