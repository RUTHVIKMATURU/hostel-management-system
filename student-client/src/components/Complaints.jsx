import { useState } from 'react';
import { Megaphone, FileText, History, Search } from 'lucide-react';
import PostComplaint from './PostComplaints';
import ComplaintsList from './ComplaintsList';

const Complaints = () => {
    const [activeTab, setActiveTab] = useState('complaint');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="complaints-container">
            <h2 className="form-title">
                <Megaphone size={28} style={{ marginRight: '10px', color: 'var(--primary)' }} />
                Complaints Section
            </h2>

            <div className="tab-header">
                <div
                    className={`tab ${activeTab === 'complaint' ? 'active' : ''}`}
                    onClick={() => setActiveTab('complaint')}
                >
                    <FileText size={20} className="tab-icon" />
                    Post Complaint
                </div>
                <div
                    className={`tab ${activeTab === 'complaint-list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('complaint-list')}
                >
                    <History size={20} className="tab-icon" />
                    Complaints History
                </div>
            </div>

            {activeTab === 'complaint-list' && (
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto 2rem auto',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        placeholder="Search complaints..."
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

            {activeTab === 'complaint' ?
                <PostComplaint /> :
                <ComplaintsList searchQuery={searchQuery} />
            }
        </div>
    );
};

export default Complaints;
