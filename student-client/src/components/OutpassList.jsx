import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useUser } from '../context/UserContext';

const OutpassList = () => {
    const { user } = useUser();
    const [outpasses, setOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOutpasses = async () => {
            if (!user?.rollNumber) {
                setError('User information not available');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching outpasses for roll number:', user.rollNumber);
                const response = await axiosInstance.get(`/student-api/all-outpasses/${user.rollNumber}`);
                console.log('Outpass API response:', response.data);
                
                if (response.data && response.data.studentOutpasses) {
                    setOutpasses(response.data.studentOutpasses);
                } else {
                    setOutpasses([]);
                    console.log('No outpasses found in response');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching outpasses:', err);
                console.error('Error details:', err.response?.data);
                setError(err.response?.data?.message || 'Failed to fetch outpasses');
                setOutpasses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOutpasses();
    }, [user?.rollNumber]);

    if (!user) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Please log in to view outpass history</div>;
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading outpass history...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                Error: {error}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>My Outpass Requests</h2>
            {outpasses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <p>No outpass requests found.</p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Your outpass history will appear here once you submit requests.
                    </p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={styles.th}>Out Time</th>
                            <th style={styles.th}>In Time</th>
                            <th style={styles.th}>Reason</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outpasses.map((outpass) => (
                            <tr key={outpass._id} style={styles.tr}>
                                <td style={styles.td}>{new Date(outpass.outTime).toLocaleString()}</td>
                                <td style={styles.td}>{new Date(outpass.inTime).toLocaleString()}</td>
                                <td style={styles.td}>{outpass.reason}</td>
                                <td style={styles.td}>{outpass.type}</td>
                                <td style={{ ...styles.td, color: getStatusColor(outpass.status) }}>
                                    {outpass.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending': return '#FFA500';
        case 'accepted': return '#4CAF50';
        case 'rejected': return '#FF0000';
        default: return '#000';
    }
};

const styles = {
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        color: '#495057',
        fontWeight: '600'
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #dee2e6'
    },
    tr: {
        '&:hover': {
            backgroundColor: '#f8f9fa'
        }
    }
};

export default OutpassList;
