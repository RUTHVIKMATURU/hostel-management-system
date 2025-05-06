import { useState, useEffect } from 'react';
import { Megaphone, CalendarDays, History, Bell, Search } from 'lucide-react';
import TodayAnnouncements from './TodayAnnouncements';
import AllAnnouncements from './AllAnnouncements';

// Define theme colors - matching with RootLayout
const theme = {
    primary: '#6C63FF', // Purple accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter dark
    surfaceHover: '#2D2D2D', // Hover state
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    accent: '#6C63FF', // Purple accent
    error: '#CF6679',
    divider: '#2D2D2D',
    overlay: 'rgba(0, 0, 0, 0.5)',
    elevation1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    elevation2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    elevation3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
};

const Announcement = () => {
    const [activeTab, setActiveTab] = useState('today'); // Default to today's announcements
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Animation effect when component mounts
    useEffect(() => {
        const header = document.getElementById('announcement-header');
        const tabs = document.getElementById('announcement-tabs');

        if (header) header.classList.add('fade-in');
        if (tabs) tabs.classList.add('slide-up');

        return () => {
            if (header) header.classList.remove('fade-in');
            if (tabs) tabs.classList.remove('slide-up');
        };
    }, []);

    return (
        <div style={styles.container}>
            {/* Header with animation */}
            <div id="announcement-header" style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.iconContainer}>
                        <Bell size={32} style={styles.bellIcon} />
                        <div style={styles.pulseEffect}></div>
                    </div>
                    <h1 style={styles.title}>Announcements</h1>
                    <p style={styles.subtitle}>Stay updated with the latest hostel announcements</p>
                </div>
            </div>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
                <div style={{
                    ...styles.searchBar,
                    boxShadow: isSearchFocused ? `0 0 0 2px ${theme.primary}` : styles.searchBar.boxShadow
                }}>
                    <Search size={20} color={isSearchFocused ? theme.primary : theme.textSecondary} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* Tab Headers with animation */}
            <div id="announcement-tabs" style={styles.tabContainer}>
                <div style={styles.tabHeader}>
                    <div
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === 'today' ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                            color: activeTab === 'today' ? theme.primary : theme.textSecondary,
                            borderBottom: activeTab === 'today' ? `2px solid ${theme.primary}` : '2px solid transparent'
                        }}
                        onClick={() => setActiveTab('today')}
                    >
                        <CalendarDays size={20} style={{ marginRight: '8px' }} />
                        <span>Today's Announcements</span>
                    </div>
                    <div
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === 'all' ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                            color: activeTab === 'all' ? theme.primary : theme.textSecondary,
                            borderBottom: activeTab === 'all' ? `2px solid ${theme.primary}` : '2px solid transparent'
                        }}
                        onClick={() => setActiveTab('all')}
                    >
                        <History size={20} style={{ marginRight: '8px' }} />
                        <span>All Announcements</span>
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            <div style={styles.contentContainer}>
                {activeTab === 'today' ?
                    <TodayAnnouncements searchQuery={searchQuery} /> :
                    <AllAnnouncements searchQuery={searchQuery} />
                }
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '0',
        backgroundColor: theme.background,
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: theme.surface,
        padding: '3rem 2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: theme.elevation2,
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
    },
    headerContent: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
    },
    iconContainer: {
        width: '80px',
        height: '80px',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        position: 'relative',
    },
    bellIcon: {
        color: theme.primary,
    },
    pulseEffect: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `2px solid ${theme.primary}`,
        animation: 'pulse 2s infinite',
    },
    title: {
        color: theme.text,
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.primary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        color: theme.textSecondary,
        fontSize: '1.1rem',
        maxWidth: '600px',
        margin: '0 auto',
    },
    searchContainer: {
        padding: '0 2rem',
        marginBottom: '2rem',
    },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderRadius: '50px',
        padding: '0.75rem 1.5rem',
        boxShadow: theme.elevation1,
        transition: theme.transition,
    },
    searchInput: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        marginLeft: '10px',
        color: theme.text,
        fontSize: '1rem',
        outline: 'none',
    },
    tabContainer: {
        padding: '0 2rem',
        marginBottom: '2rem',
    },
    tabHeader: {
        display: 'flex',
        backgroundColor: theme.surface,
        borderRadius: '12px',
        padding: '0.5rem',
        boxShadow: theme.elevation1,
    },
    tab: {
        flex: 1,
        padding: '1rem 1.5rem',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        transition: theme.transition,
    },
    contentContainer: {
        flex: 1,
        padding: '0 2rem 2rem',
    },
};

export default Announcement;