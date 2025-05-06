import { useState } from 'react';
import axios from '../utils/axios';
import { UserPlus, X, Save, AlertCircle } from 'lucide-react';

const AddStudent = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        branch: '',
        year: '',
        phoneNumber: '',
        email: '',
        parentMobileNumber: '',
        roomNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/admin-api/add-student', formData);
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-content">
            <div className="admin-modal-header">
                <h3 className="admin-modal-title">
                    <UserPlus size={24} color="var(--primary)" />
                    Add New Student
                </h3>
                <button
                    type="button"
                    className="admin-modal-close"
                    onClick={onCancel}
                >
                    &times;
                </button>
            </div>
            <div className="admin-modal-body">
                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Full Name</label>
                            <input
                                type="text"
                                className="admin-form-control"
                                name="name"
                                placeholder="Enter student's full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Roll Number</label>
                            <input
                                type="text"
                                className="admin-form-control"
                                name="rollNumber"
                                placeholder="Enter unique roll number"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Branch</label>
                            <input
                                type="text"
                                className="admin-form-control"
                                name="branch"
                                placeholder="e.g. CSE, ECE, ME"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Year</label>
                            <select
                                className="admin-form-control"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="admin-form-control"
                                name="phoneNumber"
                                placeholder="Student's contact number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Email</label>
                            <input
                                type="email"
                                className="admin-form-control"
                                name="email"
                                placeholder="Student's email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Parent Mobile Number</label>
                            <input
                                type="tel"
                                className="admin-form-control"
                                name="parentMobileNumber"
                                placeholder="Parent's contact number"
                                value={formData.parentMobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Room Number</label>
                            <input
                                type="text"
                                className="admin-form-control"
                                name="roomNumber"
                                placeholder="Hostel room number"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Password</label>
                            <input
                                type="password"
                                className="admin-form-control"
                                name="password"
                                placeholder="Create a secure password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="admin-button secondary"
                            onClick={onCancel}
                        >
                            <X size={18} />
                            <span>Cancel</span>
                        </button>
                        <button
                            type="submit"
                            className="admin-button primary"
                            disabled={loading}
                        >
                            <Save size={18} />
                            <span>{loading ? 'Adding...' : 'Add Student'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;