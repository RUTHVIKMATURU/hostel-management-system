import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const OutpassList = () => {
    const { user } = useUser();
    const [outpasses, setOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(user)

    useEffect(() => {
        const fetchOutpasses = async () => {
            // console.log("out pass response: ",response.data);
            try {
                const response = await axios.get(`http://localhost:3000/student-api/all-outpasses/${user.rollNumber}`);
                setOutpasses(response.data.studentOutpasses || []);
            } catch (err) {
                setError('Failed to fetch outpasses');
            } finally {
                setLoading(false);
            }
        };

        fetchOutpasses();
    }, [user.rollNumber]);

    if (loading) return <p>Loading outpasses...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (outpasses.length === 0) return <p>No outpass requests found.</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>My Outpass Requests</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#333', color: '#fff' }}>
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
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return '#FFA500';
        case 'accepted': return '#4CAF50';
        case 'rejected': return '#FF0000';
        default: return '#000';
    }
};

const styles = {
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #555' },
    td: { padding: '10px', borderBottom: '1px solid #ccc' },
    tr: { backgroundColor: '#f9f9f9' },
};

export default OutpassList;
