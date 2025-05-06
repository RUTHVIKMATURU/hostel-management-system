import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { 
    Settings as SettingsIcon, User, Lock, Mail, Shield, 
    Save, RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff 
} from 'lucide-react';

const Settings = () => {
    const { admin, updateAdmin } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (admin) {
            setFormData(prevData => ({
                ...prevData,
                username: admin.username || '',
                email: admin.email || ''
            }));
        }
    }, [admin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validatePasswordForm = () => {
        if (!formData.currentPassword) {
            setMessage({ type: 'error', text: 'Current password is required' });
            return false;
        }
        
        if (!formData.newPassword) {
            setMessage({ type: 'error', text: 'New password is required' });
            return false;
        }
        
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return false;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return false;
        }
        
        return true;
    };

    const validateProfileForm = () => {
        if (!formData.username.trim()) {
            setMessage({ type: 'error', text: 'Username is required' });
            return false;
        }
        
        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Email is required' });
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return false;
        }
        
        return true;
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        if (!validateProfileForm()) {
            return;
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await axios.put('/admin-api/update-profile', {
                username: formData.username,
                email: formData.email
            });
            
            if (response.data.admin) {
                updateAdmin(response.data.admin);
                setMessage({ type: 'success', text: 'Profile updated successfully' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) {
            return;
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await axios.put('/admin-api/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            
            setMessage({ type: 'success', text: 'Password changed successfully' });
            
            // Clear password fields
            setFormData(prevData => ({
                ...prevData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to change password' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">
                        <SettingsIcon size={24} color="var(--primary)" />
                        Settings
                    </h3>
                </div>
                
                <div className="admin-card-body">
                    <div className="settings-tabs">
                        <button 
                            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </button>
                        <button 
                            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={18} />
                            <span>Security</span>
                        </button>
                    </div>
                    
                    {message.text && (
                        <div className={`settings-message ${message.type}`}>
                            {message.type === 'error' ? (
                                <AlertCircle size={18} />
                            ) : message.type === 'success' ? (
                                <CheckCircle size={18} />
                            ) : null}
                            <span>{message.text}</span>
                        </div>
                    )}
                    
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileUpdate} className="settings-form">
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <User size={16} />
                                    <span>Username</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="admin-form-control"
                                    placeholder="Enter username"
                                />
                            </div>
                            
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Mail size={16} />
                                    <span>Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="admin-form-control"
                                    placeholder="Enter email"
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="admin-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} className="spinner" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                    
                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordChange} className="settings-form">
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Lock size={16} />
                                    <span>Current Password</span>
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        placeholder="Enter current password"
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Lock size={16} />
                                    <span>New Password</span>
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        placeholder="Enter new password"
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Lock size={16} />
                                    <span>Confirm New Password</span>
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        placeholder="Confirm new password"
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="admin-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} className="spinner" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Change Password</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
