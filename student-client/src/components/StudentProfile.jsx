import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, Mail, Phone, Home, BookOpen, School, Edit, Save, X, Camera, Check } from 'lucide-react';

// Define theme colors - matching with RootLayout
const theme = {
  primary: '#6C63FF', // Purple accent
  background: '#121212', // Dark background
  surface: '#1E1E1E', // Slightly lighter dark
  surfaceHover: '#2D2D2D', // Hover state
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  divider: '#2D2D2D',
  elevation1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  elevation2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  elevation3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
};

function StudentProfile() {
  const { user, updateProfile } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    parentMobileNumber: '',
    roomNumber: '',
  });

  useEffect(() => {
    console.log('User data in profile:', user);

    // Initialize form data with user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        parentMobileNumber: user.parentMobileNumber || '',
        roomNumber: user.roomNumber || '',
      });
    }

    // Add animation delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        parentMobileNumber: user.parentMobileNumber || '',
        roomNumber: user.roomNumber || '',
      });
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phoneNumber || !formData.parentMobileNumber || !formData.roomNumber) {
        throw new Error('All fields are required');
      }

      // Update profile
      await updateProfile(formData);

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className={isLoaded ? 'fade-in' : ''}>
      <div style={styles.card} className={isLoaded ? 'slide-up' : ''}>
        <div style={styles.header}>
          <h2 style={styles.headerText}>Student Profile</h2>
          {isEditing ? (
            <div style={styles.editButtonGroup}>
              <button
                onClick={toggleEditMode}
                style={styles.cancelButton}
                className="cancel-button-hover"
                disabled={isSubmitting}
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit}
                style={styles.saveButton}
                className="save-button-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div style={styles.buttonSpinner}></div>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEditMode}
              style={styles.editButton}
              className="edit-button-hover"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {successMessage && (
          <div style={styles.successMessage}>
            <Check size={18} color="#03DAC5" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={styles.errorMessage}>
            <X size={18} color="#CF6679" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div style={styles.profileSection}>
          <div style={styles.imageContainer}>
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" style={styles.image} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div style={styles.avatarRing}></div>
            {isEditing && (
              <button style={styles.uploadPhotoButton} className="upload-photo-hover">
                <Camera size={18} color={theme.text} />
              </button>
            )}
          </div>

          <div style={styles.nameSection}>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.nameInput}
                placeholder="Your Name"
              />
            ) : (
              <h3 style={styles.userName}>{user.name || 'Student'}</h3>
            )}
            <div style={styles.badge}>Student</div>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoContainer}>
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <div style={styles.infoHeader}>
                <User size={18} color={theme.primary} />
                <p style={styles.infoLabel}>Roll Number</p>
              </div>
              <p style={styles.infoValue}>{user.rollNumber || 'Not available'}</p>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoHeader}>
                <School size={18} color={theme.primary} />
                <p style={styles.infoLabel}>Branch</p>
              </div>
              <p style={styles.infoValue}>{user.branch || 'Not available'}</p>
            </div>
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <div style={styles.infoHeader}>
                <BookOpen size={18} color={theme.primary} />
                <p style={styles.infoLabel}>Year of Study</p>
              </div>
              <p style={styles.infoValue}>{user.year || 'Not available'}</p>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoHeader}>
                <Home size={18} color={theme.primary} />
                <p style={styles.infoLabel}>Room Number</p>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  style={styles.editInput}
                  placeholder="Room Number"
                />
              ) : (
                <p style={styles.infoValue}>{user.roomNumber || 'Not available'}</p>
              )}
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.contactSection}>
            <h4 style={styles.sectionTitle}>Contact Information</h4>

            <div
              style={styles.contactItem}
              className={!isEditing ? "contact-item-hover" : ""}
            >
              <div style={styles.contactIcon}>
                <Mail size={18} color={theme.primary} />
              </div>
              <div style={styles.contactContent}>
                <p style={styles.contactLabel}>Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.editInput}
                    placeholder="Email Address"
                  />
                ) : (
                  <p style={styles.contactValue}>{user.email || 'Not available'}</p>
                )}
              </div>
            </div>

            <div
              style={styles.contactItem}
              className={!isEditing ? "contact-item-hover" : ""}
            >
              <div style={styles.contactIcon}>
                <Phone size={18} color={theme.primary} />
              </div>
              <div style={styles.contactContent}>
                <p style={styles.contactLabel}>Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={styles.editInput}
                    placeholder="Phone Number"
                  />
                ) : (
                  <p style={styles.contactValue}>{user.phoneNumber || 'Not available'}</p>
                )}
              </div>
            </div>

            <div
              style={styles.contactItem}
              className={!isEditing ? "contact-item-hover" : ""}
            >
              <div style={styles.contactIcon}>
                <Phone size={18} color={theme.primary} />
              </div>
              <div style={styles.contactContent}>
                <p style={styles.contactLabel}>Parent Mobile Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="parentMobileNumber"
                    value={formData.parentMobileNumber}
                    onChange={handleChange}
                    style={styles.editInput}
                    placeholder="Parent Mobile Number"
                  />
                ) : (
                  <p style={styles.contactValue}>{user.parentMobileNumber || 'Not available'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.elevation2,
    overflow: 'hidden',
    border: `1px solid ${theme.divider}`,
    transition: theme.transition,
  },
  header: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    padding: '1.5rem',
    color: theme.text,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.divider}`,
  },
  headerText: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    color: theme.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: theme.transition,
    fontWeight: '500',
  },
  editButtonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(207, 102, 121, 0.1)',
    color: '#CF6679',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: theme.transition,
    fontWeight: '500',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    color: theme.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: theme.transition,
    fontWeight: '500',
  },
  buttonSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(108, 99, 255, 0.1)',
    borderRadius: '50%',
    borderTop: `2px solid ${theme.primary}`,
    animation: 'spin 1s linear infinite',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(3, 218, 197, 0.1)',
    color: '#03DAC5',
    margin: '0',
    borderBottom: `1px solid ${theme.divider}`,
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(207, 102, 121, 0.1)',
    color: '#CF6679',
    margin: '0',
    borderBottom: `1px solid ${theme.divider}`,
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.5rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.03)',
    position: 'relative',
  },
  imageContainer: {
    marginBottom: '1.5rem',
    position: 'relative',
  },
  image: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `5px solid ${theme.surface}`,
    boxShadow: theme.elevation2,
    zIndex: 2,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: theme.primary,
    color: theme.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    fontWeight: 'bold',
    border: `5px solid ${theme.surface}`,
    boxShadow: theme.elevation2,
    zIndex: 2,
    position: 'relative',
  },
  avatarRing: {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    borderRadius: '50%',
    border: `2px solid ${theme.primary}`,
    opacity: 0.5,
    animation: 'pulse 2s infinite',
  },
  uploadPhotoButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: theme.elevation2,
    zIndex: 3,
    transition: theme.transition,
  },
  nameSection: {
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    maxWidth: '300px',
    padding: '0.75rem 1rem',
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    color: theme.text,
    border: `1px solid rgba(108, 99, 255, 0.2)`,
    borderRadius: '8px',
    marginBottom: '0.75rem',
    outline: 'none',
    transition: theme.transition,
  },
  userName: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0',
    color: theme.text,
    background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.primary} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    color: theme.primary,
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: `1px solid rgba(108, 99, 255, 0.2)`,
  },
  divider: {
    height: '1px',
    backgroundColor: theme.divider,
    margin: '0',
  },
  infoContainer: {
    padding: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -10px 1.5rem -10px',
  },
  infoItem: {
    flex: '1 0 50%',
    padding: '0 10px',
    marginBottom: '1rem',
    minWidth: '200px',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: theme.textSecondary,
    margin: 0,
  },
  infoValue: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: theme.text,
    margin: 0,
    paddingLeft: '1.75rem',
  },
  editInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    color: theme.text,
    border: `1px solid rgba(108, 99, 255, 0.2)`,
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: theme.transition,
    marginLeft: '1.75rem',
  },
  contactSection: {
    marginTop: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: theme.primary,
    marginBottom: '1.25rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(108, 99, 255, 0.03)',
    borderRadius: '8px',
    transition: theme.transition,
  },
  contactIcon: {
    marginRight: '1rem',
    marginTop: '0.25rem',
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: '0.875rem',
    color: theme.textSecondary,
    margin: '0 0 0.25rem 0',
  },
  contactValue: {
    fontSize: '1rem',
    color: theme.text,
    margin: 0,
    wordBreak: 'break-all',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    backgroundColor: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.elevation2,
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(108, 99, 255, 0.1)',
    borderRadius: '50%',
    borderTop: `3px solid ${theme.primary}`,
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: theme.textSecondary,
  }
};

export default StudentProfile;
