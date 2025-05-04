import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const ComplaintsList = () => {
    const { user } = useUser();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student-api/get-complaints/${user.rollNumber}`);
                setComplaints(response.data || []);
            } catch (err) {
                setError('Failed to fetch complaints.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [user.rollNumber]);

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem', color: '#E59D00' }}>Loading complaints...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</p>;
    if (complaints.length === 0) return <p style={{ textAlign: 'center', padding: '2rem', color: '#E59D00' }}>No complaints found.</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Complaints</h2>
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
                    {complaints.map((complaint) => (
                        <tr key={complaint._id} style={styles.row}>
                            <td style={styles.td}>{complaint.category}</td>
                            <td style={styles.td}>{complaint.description}</td>
                            <td style={{ ...styles.td, ...getStatusStyle(complaint.status) }}>
                                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </td>
                            <td style={styles.td}>{new Date(complaint.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'pending': return { color: '#E59D00', backgroundColor: '#FFF9E6' }; // Yellow for pending
        case 'active': return { color: '#E59D00', backgroundColor: '#FFF9E6' }; // Yellow for active
        case 'solved': return { color: '#4CAF50', backgroundColor: '#E8F5E9' }; // Keep green for solved
        case 'rejected': return { color: '#FF0000', backgroundColor: '#FFEBEE' }; // Keep red for rejected
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
        borderTop: '5px solid #FFAE00', // Added yellow accent border
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#E59D00', // Changed to darker yellow
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px',
        backgroundColor: '#FFAE00', // Changed to primary yellow
        color: '#FFF',
        textAlign: 'left',
        fontWeight: '600',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid #FFE082', // Changed to light yellow
    },
    row: {
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#FFF9E6', // Light yellow on hover
        }
    },
};

export default ComplaintsList;
