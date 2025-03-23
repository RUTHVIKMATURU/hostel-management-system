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

    if (loading) return <p>Loading complaints...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (complaints.length === 0) return <p>No complaints found.</p>;

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
        case 'pending': return { color: '#FFA500', backgroundColor: '#FFF7E6' };
        case 'resolved': return { color: '#4CAF50', backgroundColor: '#E8F5E9' };
        case 'rejected': return { color: '#FF0000', backgroundColor: '#FFEBEE' };
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
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px',
        backgroundColor: '#1E1E2F',
        color: '#FFF',
        textAlign: 'left',
        fontWeight: '600',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid #ccc',
    },
    row: {
        transition: 'background-color 0.3s',
    },
};

export default ComplaintsList;
