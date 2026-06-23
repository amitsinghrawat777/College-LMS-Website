import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Search } from 'lucide-react';
import { contestsData } from '../data/mockData';

export default function Contests({ contests, setContests, setCurrentPage, setActiveContestId, triggerNotification }) {
  const [activeTab, setActiveTab] = useState('my');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAction, setLoadingAction] = useState(null); // { id, type }

  const handleActiveCardClick = (contestId) => {
    setActiveContestId(contestId);
    setCurrentPage('contest-detail');
  };

  const handleLaunchMock = (contestId, contestTitle) => {
    setLoadingAction({ id: contestId, type: 'mock' });
    setTimeout(() => {
      setLoadingAction(null);
      triggerNotification('success', `Mock Practice environment loaded for ${contestTitle}! 🚀`);
      setActiveContestId(contestId);
      setCurrentPage('contest-detail');
    }, 800);
  };

  const handleLaunchAssessment = (contestId, contestTitle) => {
    setLoadingAction({ id: contestId, type: 'assessment' });
    setTimeout(() => {
      setLoadingAction(null);
      triggerNotification('info', `Assessment environment initialized for ${contestTitle}. Good luck! 📝`);
      setActiveContestId(contestId);
      setCurrentPage('contest-detail');
    }, 800);
  };

  // Filter and sort contests dynamically
  const filteredContests = contests
    .filter(c => {
      if (activeTab === 'past') {
        return c.status === 'Completed';
      }
      return true;
    })
    .filter(c => {
      if (searchTerm) {
        const titleMatch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const subjectMatch = c.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = (c.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || subjectMatch || categoryMatch;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const renderCatalogRow = (contest) => {
    const isMockLoading = loadingAction?.id === contest.id && loadingAction?.type === 'mock';
    const isAssLoading = loadingAction?.id === contest.id && loadingAction?.type === 'assessment';
    const isAnyLoading = !!loadingAction;

    let statusBg = 'rgba(16, 185, 129, 0.08)';
    let statusColor = 'var(--success)';
    let showPulse = true;
    
    if (contest.status === 'Completed') {
      statusBg = 'rgba(59, 130, 246, 0.08)';
      statusColor = 'var(--primary)';
      showPulse = false;
    } else if (contest.status === 'Upcoming') {
      statusBg = 'rgba(245, 158, 11, 0.08)';
      statusColor = 'var(--warning)';
      showPulse = false;
    }

    const formattedDate = new Date(contest.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div 
        key={contest.id}
        className="catalog-row animate-fade-in"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '16px',
          gap: '24px',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Left side: Metadata & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h4 
              onClick={() => handleActiveCardClick(contest.id)}
              className="contest-title-link"
              style={{ fontSize: '1.25rem', fontWeight: '750', color: 'var(--text-primary)', margin: 0, cursor: 'pointer' }}
            >
              {contest.title}
            </h4>
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: statusColor,
              backgroundColor: statusBg,
              padding: '4px 10px',
              borderRadius: '8px'
            }}>
              {showPulse && <span className="live-pulse-dot" style={{ backgroundColor: 'var(--success)' }} />}
              {contest.status}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{contest.category || contest.subject}</span>
            <span>•</span>
            <span>{contest.duration}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Right side: Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleLaunchMock(contest.id, contest.title)}
            disabled={isAnyLoading}
            className="catalog-btn-secondary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '120px',
              height: '42px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isMockLoading ? (
              <span className="spinner-small" />
            ) : (
              <span>Mock Test</span>
            )}
          </button>
          <button
            onClick={() => handleLaunchAssessment(contest.id, contest.title)}
            disabled={isAnyLoading}
            className="catalog-btn-primary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '120px',
              height: '42px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isAssLoading ? (
              <span className="spinner-small" />
            ) : (
              <span>Assessment</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container animate-fade-in" style={{ padding: '40px 32px' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '850', color: 'var(--logo-title-color)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          University Contests
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: '500' }}>
          Practice with Mock exams or start your formal Assessment.
        </p>
      </div>

      {/* Main Panel */}
      <div className="glass-card" style={{ padding: '32px' }}>
        
        {/* Navigation Tabs and Search */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '16px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Tab Selection */}
          <div style={{ display: 'flex', gap: '28px' }}>
            <button 
              onClick={() => setActiveTab('my')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: activeTab === 'my' ? 'var(--primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: '18px',
                transition: 'color 0.2s'
              }}
            >
              My Contests
              {activeTab === 'my' && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '3px'
                }} />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: '18px',
                transition: 'color 0.2s'
              }}
            >
              Past Contests
              {activeTab === 'past' && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '3px'
                }} />
              )}
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-tertiary)' 
              }} 
            />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </div>



        {/* Contest List Grid/Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredContests.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '1.5px dashed var(--border-color)',
              borderRadius: '20px'
            }}>
              <Calendar size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: '750', marginBottom: '8px', color: 'var(--text-primary)' }}>
                No Contests Found
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: 0 }}>
                No contests match your search and category selection. Try selecting "All Contests" or modifying your search term.
              </p>
            </div>
          ) : (
            filteredContests.map(c => renderCatalogRow(c))
          )}
        </div>

      </div>

      {/* Scoped CSS Styles */}
      <style>{`
        .catalog-row:hover {
          transform: translateY(-2px);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-md) !important;
        }
        
        .contest-title-link {
          transition: color 0.2s ease;
        }
        .contest-title-link:hover {
          color: var(--primary) !important;
          text-decoration: underline;
        }

        .catalog-btn-secondary {
          background: transparent;
          border: 1.5px solid var(--border-color);
          color: var(--text-secondary);
        }
        .catalog-btn-secondary:hover:not(:disabled) {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--text-secondary);
        }

        .catalog-btn-primary {
          background: var(--primary);
          border: none;
          color: white;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
        }
        .catalog-btn-primary:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }

        .catalog-btn-primary:disabled, .catalog-btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spinnerRotate 0.6s linear infinite;
        }
        .catalog-btn-primary .spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
        }
        @keyframes spinnerRotate {
          to { transform: rotate(360deg); }
        }

        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          animation: pulseLiveDot 1.2s infinite ease-in-out;
        }
        @keyframes pulseLiveDot {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
