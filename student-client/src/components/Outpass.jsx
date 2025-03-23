import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Outpass() {
    const { user } = useUser();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    

    // console.log(user)

    console.log('User name:', user.name);
    console.log('mobile: ', user.mobileNumber);

    const onSubmit = async (data) => {
        try {
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

            console.log('Submitting Payload:', payload);

            const response = await axios.post('http://localhost:3000/student-api/apply-outpass', payload);

            console.log('API Response:', response);
            alert(response.data.message || 'Outpass request submitted successfully!');

            reset();
            navigate('/home');
        } catch (error) {
            console.error('Error Details:', error);
            alert(error.response?.data?.message || 'Failed to submit outpass request');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '2rem', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Apply for Outpass</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="form-label">Out Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        {...register('outTime', { required: 'Out time is required' })}
                    />
                    {errors.outTime && <small style={{ color: 'red' }}>{errors.outTime.message}</small>}
                </div>

                <div className="mb-3">
                    <label className="form-label">In Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        {...register('inTime', { required: 'In time is required' })}
                    />
                    {errors.inTime && <small style={{ color: 'red' }}>{errors.inTime.message}</small>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Reason for Outpass</label>
                    <textarea
                        className="form-control"
                        placeholder="Enter reason"
                        {...register('reason', { required: 'Reason is required', maxLength: 200 })}
                    />
                    {errors.reason && <small style={{ color: 'red' }}>{errors.reason.message}</small>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Outpass Type</label>
                    <select
                        className="form-control"
                        {...register('type', { required: 'Type of outpass is required' })}
                    >
                        <option value="">Select Type</option>
                        <option value="late pass">Late Pass</option>
                        <option value="home pass">Home Pass</option>
                    </select>
                    {errors.type && <small style={{ color: 'red' }}>{errors.type.message}</small>}
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit Outpass</button>
            </form>
        </div>
    );
}

export default Outpass;
