import { useState } from 'react';
import { FileText, History, Search } from 'lucide-react';
import Outpass from './Outpass';
import OutpassList from './OutpassList';

const OutpassPage = () => {
    const [activeTab, setActiveTab] = useState('outpass');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="outpass-container">
            <h2 className="form-title">
                <FileText size={28} style={{ marginRight: '10px', color: 'var(--primary)' }} />
                Outpass Application
            </h2>

            <div className="tab-header">
                <div
                    className={`tab ${activeTab === 'outpass' ? 'active' : ''}`}
                    onClick={() => setActiveTab('outpass')}
                >
                    <FileText size={20} className="tab-icon" />
                    Apply For Outpass
                </div>
                <div
                    className={`tab ${activeTab === 'outpassList' ? 'active' : ''}`}
                    onClick={() => setActiveTab('outpassList')}
                >
                    <History size={20} className="tab-icon" />
                    Outpass History
                </div>
            </div>

            {activeTab === 'outpassList' && (
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto 2rem auto',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        placeholder="Search outpass requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        style={{
                            paddingLeft: '2.5rem',
                        }}
                    />
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)'
                        }}
                    />
                </div>
            )}

            {activeTab === 'outpass' ?
                <Outpass /> :
                <OutpassList searchQuery={searchQuery} />
            }
        </div>
    );
};

export default OutpassPage;
