import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AlertTriangle, Send, CheckCircle, X } from 'lucide-react';

const PostComplaint = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            if (!category) {
                throw new Error('Please select a category');
            }

            if (description.length < 10) {
                throw new Error('Description should be at least 10 characters long');
            }

            const payload = {
                category,
                description,
                complaintBy: user.rollNumber
            };

            const response = await axiosInstance.post('/student-api/post-complaint', payload);

            // Clear form
            setCategory('');
            setDescription('');

            // Show success message
            setSuccess(response.data.message || 'Complaint submitted successfully!');

            // Navigate after a short delay
            setTimeout(() => {
                navigate('/complaints', { state: { activeTab: 'complaint-list' } });
            }, 2000);

        } catch (err) {
            console.error('Error submitting complaint:', err);
            if (err.message) {
                setError(err.message);
            } else {
                setError(err.response?.data?.error || 'Failed to submit complaint');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="complaint-form">
            <h3 className="form-title">Submit a Complaint</h3>

            {error && (
                <div className="alert alert-error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <CheckCircle size={18} />
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                        className="form-control form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                    {category === '' && (
                        <div className="form-error">
                            <X size={14} />
                            <span>Please select a category</span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue in detail..."
                        rows={5}
                    />
                    {description.length > 0 && description.length < 10 && (
                        <div className="form-error">
                            <X size={14} />
                            <span>Description should be at least 10 characters</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting || !category || description.length < 10}
                >
                    {isSubmitting ? (
                        <>
                            <div className="button-spinner"></div>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            <span>Submit Complaint</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PostComplaint;
