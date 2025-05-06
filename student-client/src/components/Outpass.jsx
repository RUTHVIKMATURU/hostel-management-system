import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AlertTriangle, Send, CheckCircle, Clock, Calendar, Home, AlertCircle } from 'lucide-react';

function Outpass() {
    const { user } = useUser();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Watch form values for validation
    const outTime = watch('outTime');
    const inTime = watch('inTime');
    const reason = watch('reason');
    const type = watch('type');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Validate that in time is after out time
            const outTimeDate = new Date(data.outTime);
            const inTimeDate = new Date(data.inTime);

            if (inTimeDate <= outTimeDate) {
                throw new Error('In time must be after out time');
            }

            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            const payload = {
                ...data,
                name: user?.name,
                rollNumber: user?.rollNumber,
                studentMobileNumber: user?.phoneNumber,
                parentMobileNumber: user?.parentMobileNumber,
                month,
                year
            };

            const response = await axios.post('http://localhost:3000/student-api/apply-outpass', payload);

            setSuccess(response.data.message || 'Outpass request submitted successfully!');
            reset();

            // Navigate after a short delay
            setTimeout(() => {
                navigate('/outpass', { state: { activeTab: 'outpassList' } });
            }, 2000);

        } catch (error) {
            console.error('Error Details:', error);
            setError(error.message || error.response?.data?.message || 'Failed to submit outpass request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="outpass-form">
            <h3 className="form-title">Apply for Outpass</h3>

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

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="date-time-group">
                    <div className="form-group">
                        <label className="form-label">
                            <Clock size={16} style={{ marginRight: '0.5rem' }} />
                            Out Time
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            {...register('outTime', { required: true })}
                        />
                        {errors.outTime && (
                            <div className="form-error">
                                <AlertCircle size={14} />
                                <span>Out time is required</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                            In Time
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            {...register('inTime', { required: true })}
                        />
                        {errors.inTime && (
                            <div className="form-error">
                                <AlertCircle size={14} />
                                <span>In time is required</span>
                            </div>
                        )}
                        {outTime && inTime && new Date(inTime) <= new Date(outTime) && (
                            <div className="form-error">
                                <AlertCircle size={14} />
                                <span>In time must be after out time</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Reason for Outpass</label>
                    <textarea
                        className="form-control form-textarea"
                        placeholder="Please provide a detailed reason for your outpass request..."
                        {...register('reason', {
                            required: true,
                            minLength: 10,
                            maxLength: 200
                        })}
                        rows={4}
                    />
                    {errors.reason?.type === 'required' && (
                        <div className="form-error">
                            <AlertCircle size={14} />
                            <span>Reason is required</span>
                        </div>
                    )}
                    {errors.reason?.type === 'minLength' && (
                        <div className="form-error">
                            <AlertCircle size={14} />
                            <span>Reason should be at least 10 characters</span>
                        </div>
                    )}
                    {errors.reason?.type === 'maxLength' && (
                        <div className="form-error">
                            <AlertCircle size={14} />
                            <span>Reason should not exceed 200 characters</span>
                        </div>
                    )}
                    {reason && (
                        <div style={{
                            textAlign: 'right',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            marginTop: '0.25rem'
                        }}>
                            {reason.length}/200 characters
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <Home size={16} style={{ marginRight: '0.5rem' }} />
                        Outpass Type
                    </label>
                    <select
                        className="form-control form-select"
                        {...register('type', { required: true })}
                    >
                        <option value="">Select Type</option>
                        <option value="late pass">Late Pass</option>
                        <option value="home pass">Home Pass</option>
                    </select>
                    {errors.type && (
                        <div className="form-error">
                            <AlertCircle size={14} />
                            <span>Please select an outpass type</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting || !outTime || !inTime || !reason || !type || (outTime && inTime && new Date(inTime) <= new Date(outTime))}
                >
                    {isSubmitting ? (
                        <>
                            <div className="button-spinner"></div>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            <span>Submit Outpass</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default Outpass;
