import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PostComplaint = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log('Submitting complaint for user:', user);
            const payload = {
                category,
                description,
                complaintBy: user.rollNumber
            };
            console.log('Complaint payload:', payload);

            const response = await axiosInstance.post('/student-api/post-complaint', payload);
            console.log('Complaint submission response:', response.data);

            // Clear form
            setCategory('');
            setDescription('');
            
            // Show success message
            alert(response.data.message || 'Complaint submitted successfully!');
            
            // Force a page reload when navigating to ensure fresh data
            navigate('/complaints/complaint-list', { state: { refresh: true } });
            window.location.reload(); // Force reload to clear any cached data
        } catch (error) {
            console.error('Error submitting complaint:', error);
            setError(error.response?.data?.error || 'Failed to submit complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '2rem', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Submit a Complaint</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#333', fontWeight: '500' }}>Category</label>
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ 
                            borderColor: '#FFE082',
                            borderRadius: '5px',
                            padding: '10px',
                            outline: 'none',
                            boxShadow: 'none',
                            transition: 'border-color 0.3s'
                        }}
                    >
                        <option value="">Select a category</option>
                        <option value="network related">Network Related</option>
                        <option value="food">Food</option>
                        <option value="water">Water</option>
                        <option value="power cut">Power Cut</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="plumbing related">Plumbing Related</option>
                        <option value="electrician related">Electrician Related</option>
                        <option value="carpenter related">Carpenter Related</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label" style={{ color: '#333', fontWeight: '500' }}>Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue"
                        required
                        style={{ 
                            borderColor: '#FFE082',
                            borderRadius: '5px',
                            padding: '10px',
                            outline: 'none',
                            boxShadow: 'none',
                            transition: 'border-color 0.3s'
                        }}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn" 
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: isSubmitting ? '#FFD180' : '#FFAE00',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontWeight: '500',
                        width: '100%',
                        marginTop: '20px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
};

export default PostComplaint;
