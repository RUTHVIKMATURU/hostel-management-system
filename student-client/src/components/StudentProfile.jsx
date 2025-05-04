import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';

function StudentProfile() {
  const { user } = useUser();
  
  useEffect(() => {
    console.log('User data in profile:', user);
  }, [user]);

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.headerText}>Student Profile</h2>
        </div>
        
        <div style={styles.profileSection}>
          <div style={styles.imageContainer}>
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" style={styles.image} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
          </div>
          
          <div style={styles.nameSection}>
            <h3 style={styles.userName}>{user.name || 'Student'}</h3>
            <p style={styles.userRole}>Student</p>
          </div>
        </div>
        
        <div style={styles.divider}></div>
        
        <div style={styles.infoContainer}>
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Roll Number</p>
              <p style={styles.infoValue}>{user.rollNumber || 'Not available'}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Branch</p>
              <p style={styles.infoValue}>{user.branch || 'Not available'}</p>
            </div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Year of Study</p>
              <p style={styles.infoValue}>{user.year || 'Not available'}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Room Number</p>
              <p style={styles.infoValue}>{user.roomNumber || 'Not available'}</p>
            </div>
          </div>
          
          <div style={styles.divider}></div>
          
          <div style={styles.contactSection}>
            <h4 style={styles.sectionTitle}>Contact Information</h4>
            
            <div style={styles.contactItem}>
              <p style={styles.contactLabel}>Email</p>
              <p style={styles.contactValue}>{user.email || 'Not available'}</p>
            </div>
            
            <div style={styles.contactItem}>
              <p style={styles.contactLabel}>Phone Number</p>
              <p style={styles.contactValue}>{user.phoneNumber || 'Not available'}</p>
            </div>
            
            <div style={styles.contactItem}>
              <p style={styles.contactLabel}>Parent Mobile Number</p>
              <p style={styles.contactValue}>{user.parentMobileNumber || 'Not available'}</p>
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
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#FFAE00', // Primary yellow
    padding: '1.5rem',
    color: 'white',
  },
  headerText: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#FFF9E6', // Light yellow background
  },
  imageContainer: {
    marginBottom: '1rem',
  },
  image: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  avatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#FFAE00', // Primary yellow
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
    border: '5px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  nameSection: {
    textAlign: 'center',
  },
  userName: {
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    color: '#333',
  },
  userRole: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0,
  },
  divider: {
    height: '1px',
    backgroundColor: '#FFE082', // Light yellow divider
    margin: '0.5rem 0',
  },
  infoContainer: {
    padding: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -10px 1rem -10px',
  },
  infoItem: {
    flex: '1 0 50%',
    padding: '0 10px',
    marginBottom: '1rem',
    minWidth: '200px',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#6c757d',
    margin: '0 0 0.25rem 0',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
    margin: 0,
  },
  contactSection: {
    marginTop: '1rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#E59D00', // Darker yellow for titles
    marginBottom: '1rem',
  },
  contactItem: {
    marginBottom: '1rem',
  },
  contactLabel: {
    fontSize: '0.875rem',
    color: '#6c757d',
    margin: '0 0 0.25rem 0',
  },
  contactValue: {
    fontSize: '1rem',
    color: '#333',
    margin: 0,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '1.2rem',
    color: '#6c757d',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  }
};

export default StudentProfile;
