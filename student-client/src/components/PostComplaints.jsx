import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PostComplaint = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('user data: ',user)
            const payload = {
                category,
                description,
                complaintBy: user.rollNumber
            };
            console.log(payload)

            const response = await axios.post('http://localhost:3000/student-api/post-complaint', payload);

            alert(response.data.message || 'Complaint submitted successfully!');
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit complaint');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '2rem', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Submit a Complaint</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
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
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit Complaint</button>
            </form>
        </div>
    );
};

export default PostComplaint;
