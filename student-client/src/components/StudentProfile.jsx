import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

function StudentProfile() {
  const { user } = useUser();
  

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Student Profile</h2>
      {/* {user.profilePhoto && (
        <img src="{user.profilePhoto}" alt="Profile" style={styles.image} />
      )} */}
      <div style={styles.infoContainer}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Roll Number:</strong> {user.rollNumber}</p>
        <p><strong>Branch:</strong> {user.branch}</p>
        <p><strong>Year of Study:</strong> {user.yearOfStudy}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        <p><strong>Parent Mobile Number:</strong> {user.parentMobileNumber}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Room Number:</strong> {user.roomNumber}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  image: {
    display: 'block',
    margin: '0 auto 1rem',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  infoContainer: {
    lineHeight: '1.8',
  },
};

export default StudentProfile;
