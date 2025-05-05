import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const ComplaintsList = () => {
    const { user } = useUser();
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh

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
                console.log(`Fetching complaints for ${user.rollNumber} (refresh #${refreshKey})`);
                
                // Add cache-busting parameter to prevent caching
                const timestamp = new Date().getTime();
                const response = await axiosInstance.get(
                    `/student-api/get-complaints/${user.rollNumber}?_=${timestamp}`
                );
                
                console.log('Complaints response:', response.data);
                
                if (Array.isArray(response.data)) {
                    setComplaints(response.data);
                    console.log(`Found ${response.data.length} complaints`);
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

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#E59D00' }}>Loading complaints...</p>
            <div style={{ width: '40px', height: '40px', margin: '20px auto', border: '4px solid #FFE082', borderTopColor: '#FFAE00', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    
    

    return (
        <div style={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={styles.title}>My Complaints</h2>
                
            </div>
            
            {!complaints || complaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#FFF9E6', borderRadius: '8px' }}>
                    <p style={{ color: '#E59D00', marginBottom: '10px' }}>No complaints found.</p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Your submitted complaints will appear here.
                    </p>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Submitted On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint, index) => (
                            <tr key={complaint._id || index} style={styles.row}>
                                <td style={styles.td}>{complaint.category}</td>
                                <td style={styles.td}>{complaint.description}</td>
                                <td style={{ ...styles.td, ...getStatusStyle(complaint.status || 'active') }}>
                                    {complaint.status ? complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1) : 'Active'}
                                </td>
                                <td style={styles.td}>
                                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'Unknown date'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
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
