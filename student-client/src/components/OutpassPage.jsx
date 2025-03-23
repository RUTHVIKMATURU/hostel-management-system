import { useState } from 'react';
import { Megaphone, CalendarDays, ArrowRight } from 'lucide-react';
// import TodayAnnouncements from './TodayAnnouncements';
// import AllAnnouncements from './AllAnnouncements';
import Outpass from './Outpass';
import OutpassList from './OutpassList';

const OutpassPage = () => {
    const [activeTab, setActiveTab] = useState('outpass'); // Default to today's announcements

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
                <Megaphone size={32} style={{ marginRight: '10px' }} /> OUTPASS SECTION
            </h2>

            {/* Tab Headers */}
            <div style={tabHeaderStyle}>
                <div 
                    style={activeTab === 'outpass' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('outpass')}
                >
                    <CalendarDays size={24} style={{ marginRight: '8px' }} /> Apply For OutPass
                </div>
                <div 
                    style={activeTab === 'outpassList' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('outpassList')}
                >
                    <ArrowRight size={24} style={{ marginRight: '8px' }} /> OutPass History 
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'outpass' ? <Outpass/> : <OutpassList />}
        </div>
    );
};

export default OutpassPage;