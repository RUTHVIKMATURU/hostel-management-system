import { useState } from 'react';
import { Megaphone, CalendarDays, ArrowRight } from 'lucide-react';
import TodayAnnouncements from './TodayAnnouncements';
import AllAnnouncements from './AllAnnouncements';

const Announcement = () => {
    const [activeTab, setActiveTab] = useState('today'); // Default to today's announcements

    const tabHeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #dee2e6',
        marginBottom: '2rem'
    };

    const tabStyle = {
        padding: '0.75rem 1.5rem',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        margin: '0 1rem',
        borderBottom: '3px solid transparent'
    };

    const activeTabStyle = {
        ...tabStyle,
        borderBottom: '3px solid #0d6efd',
        color: '#0d6efd'
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Megaphone size={32} style={{ marginRight: '10px' }} /> Announcements
            </h2>

            {/* Tab Headers */}
            <div style={tabHeaderStyle}>
                <div 
                    style={activeTab === 'today' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('today')}
                >
                    <CalendarDays size={24} style={{ marginRight: '8px' }} /> Today's Announcements
                </div>
                <div 
                    style={activeTab === 'all' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('all')}
                >
                    <ArrowRight size={24} style={{ marginRight: '8px' }} /> All Announcements
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'today' ? <TodayAnnouncements /> : <AllAnnouncements />}
        </div>
    );
};

export default Announcement;