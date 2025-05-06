import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import {
    AlertCircle, CheckCircle, XCircle, Search, Filter,
    RefreshCw, Clock, Calendar, Home, FileText, MessageSquare
} from 'lucide-react';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [remarks, setRemarks] = useState('');
    const [activeTab, setActiveTab] = useState('outpass');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
                {
                    url: `/admin-api/requests/${id}`,
                    method: 'put',
                    data: {
                        status: apiStatus,
                        remarks,
                        reason: newStatus === 'rejected' ? remarks : undefined // Use remarks as rejection reason
                    }
                },
                {
                    url: `/admin-api/update-outpass-status/${id}`,
                    method: 'put',
                    data: {
                        status: apiStatus,
                        remarks,
                        reason: newStatus === 'rejected' ? remarks : undefined // Use remarks as rejection reason
                    }
                }
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

        // First apply status filter
        let statusFiltered = requests;

        if (filter !== 'all') {
            if (filter === 'approved') {
                statusFiltered = requests.filter(item =>
                    item.status === 'approved' ||
                    item.status === 'accepted'
                );
            } else if (filter === 'pending') {
                statusFiltered = requests.filter(item => item.status === 'pending');
            } else if (filter === 'rejected') {
                statusFiltered = requests.filter(item => item.status === 'rejected');
            }
        }

        // Then apply search filter if there's a search query
        if (!searchQuery) return statusFiltered;

        const query = searchQuery.toLowerCase();
        return statusFiltered.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.rollNumber?.toLowerCase().includes(query) ||
            item.reason?.toLowerCase().includes(query) ||
            item.type?.toLowerCase().includes(query)
        );
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
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading outpass requests...</p>
        </div>
    );

    const filtered = filteredItems();

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">
                        <FileText size={24} color="var(--primary)" />
                        Outpass Requests
                    </h3>

                    <div className="filter-buttons">
                        <button
                            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <Filter size={16} />
                            All ({requests.length})
                        </button>
                        <button
                            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >
                            <Clock size={16} />
                            Pending ({requests.filter(r => r.status === 'pending').length})
                        </button>
                        <button
                            className={`filter-button ${filter === 'approved' ? 'active' : ''}`}
                            onClick={() => setFilter('approved')}
                        >
                            <CheckCircle size={16} />
                            Approved ({requests.filter(r => r.status === 'approved' || r.status === 'accepted').length})
                        </button>
                        <button
                            className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
                            onClick={() => setFilter('rejected')}
                        >
                            <XCircle size={16} />
                            Rejected ({requests.filter(r => r.status === 'rejected').length})
                        </button>
                        <button
                            className="filter-button"
                            onClick={fetchData}
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
                            placeholder="Search outpass requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <Search size={18} className="search-icon" />
                    </div>

                    {error && (
                        <div className="empty-state">
                            <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--error)' }} />
                            <h3 className="empty-title" style={{ color: 'var(--error)' }}>Error</h3>
                            <p className="empty-text">{error}</p>
                            <button
                                className="admin-submit-button"
                                style={{ maxWidth: '200px' }}
                                onClick={fetchData}
                            >
                                <RefreshCw size={18} />
                                <span>Try Again</span>
                            </button>
                        </div>
                    )}

                    {!error && (
                        <>
                            {filtered.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Out Time</th>
                                                <th>In Time</th>
                                                <th>Type</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(request => (
                                                <tr key={request._id}>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontWeight: '500' }}>{request.name}</span>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{request.rollNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                                                <span>{new Date(request.outTime || request.fromDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                                <Clock size={14} style={{ color: 'var(--primary)' }} />
                                                                <span>{new Date(request.outTime || request.fromDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                                                <span>{new Date(request.inTime || request.toDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                                <Clock size={14} style={{ color: 'var(--primary)' }} />
                                                                <span>{new Date(request.inTime || request.toDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.25rem 0.75rem',
                                                            backgroundColor: 'rgba(0, 191, 166, 0.1)',
                                                            borderRadius: '50px',
                                                            width: 'fit-content'
                                                        }}>
                                                            {request.type?.toLowerCase().includes('home') ? (
                                                                <Home size={14} />
                                                            ) : (
                                                                <Clock size={14} />
                                                            )}
                                                            <span style={{ textTransform: 'capitalize' }}>{request.type || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td>{request.reason}</td>
                                                    <td>
                                                        <div className={`status-badge ${
                                                            request.status === 'approved' || request.status === 'accepted'
                                                                ? 'status-approved'
                                                                : request.status === 'rejected'
                                                                    ? 'status-rejected'
                                                                    : 'status-pending'
                                                        }`}>
                                                            {request.status === 'approved' || request.status === 'accepted' ? (
                                                                <><CheckCircle size={14} /> Approved</>
                                                            ) : request.status === 'rejected' ? (
                                                                <><XCircle size={14} /> Rejected</>
                                                            ) : (
                                                                <><Clock size={14} /> Pending</>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {(request.status === 'pending') && (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                <input
                                                                    type="text"
                                                                    className="admin-form-control"
                                                                    placeholder="Add remarks/reason (required for rejection)"
                                                                    value={selectedRequestId === request._id ? remarks : ''}
                                                                    onChange={(e) => setRemarks(e.target.value)}
                                                                    style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                                                                />
                                                                <div className="action-buttons-container">
                                                                    <button
                                                                        className="action-button action-button-approve"
                                                                        onClick={() => handleStatusUpdate(request._id, 'approved', 'outpass')}
                                                                        disabled={selectedRequestId !== null && selectedRequestId !== request._id}
                                                                        title="Approve Request"
                                                                    >
                                                                        <CheckCircle size={18} />
                                                                    </button>
                                                                    <button
                                                                        className="action-button action-button-reject"
                                                                        onClick={() => {
                                                                            if (!remarks.trim()) {
                                                                                alert('Please provide a reason for rejection');
                                                                                return;
                                                                            }
                                                                            handleStatusUpdate(request._id, 'rejected', 'outpass');
                                                                        }}
                                                                        disabled={selectedRequestId !== null && selectedRequestId !== request._id}
                                                                        title="Reject Request"
                                                                    >
                                                                        <XCircle size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {request.remarks && (
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                marginTop: '0.5rem',
                                                                fontSize: '0.85rem',
                                                                color: 'var(--text-secondary)'
                                                            }}>
                                                                <MessageSquare size={14} />
                                                                <span>{request.remarks}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <FileText size={48} className="empty-icon" />
                                    <h3 className="empty-title">No Outpass Requests Found</h3>
                                    <p className="empty-text">
                                        {searchQuery
                                            ? `No outpass requests match your search for "${searchQuery}"`
                                            : `No outpass requests found with status: ${filter}`
                                        }
                                    </p>
                                    {filter !== 'all' && (
                                        <button
                                            className="filter-button"
                                            onClick={() => setFilter('all')}
                                        >
                                            <Filter size={16} />
                                            Show all requests
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestManagement;


