import React from 'react';
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.png"

const HomePage = () => {
    return (
        <div style={styles.container}>
            <section style={{ ...styles.heroSection, backgroundImage: `url(${img1})` }}>
                <div style={styles.overlay}>
                    <h1 style={styles.heroTitle}>VNR VJIET Hostel</h1>
                    <p style={styles.heroSubtitle}>Your home away from home – Safe, Comfortable, and Supportive.</p>
                </div>
            </section>

            <section style={styles.gallerySection}>
                <h2 style={styles.sectionTitle}>Explore Our Hostel</h2>
                <div style={styles.gallery}>
                    <img src={img2} alt="Hostel Room" style={styles.galleryImage} />
                    <img src={img3} alt="Common Area" style={styles.galleryImage} />
                    <img src={img4} alt="Common Area" style={styles.galleryImage} />
                </div>
            </section>

            <section style={styles.contactSection}>
                <h2 style={styles.sectionTitle}>Emergency Contacts</h2>
                <ul style={styles.contactList}>
                    <li><strong>Hostel Warden:</strong> +91-98765-43210</li>
                    <li><strong>Security Office:</strong> +91-87654-32109</li>
                    <li><strong>Medical Assistance:</strong> +91-76543-21098</li>
                    <li><strong>Admin Office:</strong> +91-65432-10987</li>
                </ul>
            </section>

            <footer style={styles.footer}>
                &copy; 2025 VNR VJIET Hostel | All Rights Reserved
            </footer>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Poppins', sans-serif",
        color: '#2C3E50',
        backgroundColor: '#F9F9F9',
    },
    heroSection: {
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '4rem',
        borderRadius: '12px',
        textAlign: 'center',
    },
    heroTitle: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    heroSubtitle: {
        fontSize: '1.5rem',
        maxWidth: '800px',
    },
    gallerySection: {
        padding: '3rem 2rem',
        textAlign: 'center',
        background: '#E3F2FD',
    },
    gallery: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px',
    },
    galleryImage: {
        width: '350px',
        height: '250px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s',
        cursor: 'pointer',
    },
    contactSection: {
        padding: '3rem 2rem',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
    },
    contactList: {
        listStyle: 'none',
        padding: 0,
        fontSize: '1.4rem',
        lineHeight: '2.5rem',
    },
    footer: {
        textAlign: 'center',
        padding: '1.5rem',
        background: '#1A237E',
        color: 'white',
    },
};

export default HomePage;
