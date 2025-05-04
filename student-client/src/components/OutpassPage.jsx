import { useState } from 'react';
import { Megaphone, CalendarDays, ArrowRight } from 'lucide-react';
import Outpass from './Outpass';
import OutpassList from './OutpassList';

const OutpassPage = () => {
    const [activeTab, setActiveTab] = useState('outpass');

    const tabHeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #FFE082', // Changed to light yellow
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
        borderBottom: '3px solid #FFAE00', // Changed to primary yellow
        color: '#FFAE00' // Changed to primary yellow
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#FFF9E6' }}> {/* Added light yellow background */}
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#E59D00' }}> {/* Changed to darker yellow */}
                <Megaphone size={32} style={{ marginRight: '10px' }} /> OUTPASS SECTION
            </h2>

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

            {activeTab === 'outpass' ? <Outpass /> : <OutpassList />}
        </div>
    );
};

export default OutpassPage;
