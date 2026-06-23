import React from 'react';
import { Calendar, Users, FileText, Percent, BarChart3 } from 'lucide-react';

export default function FacultyDashboard({ contests, setCurrentPage }) {
  const totalContests = contests.length;
  const activeContests = contests.filter((contest) => contest.status === 'Active').length;
  const totalParticipants = contests.reduce((acc, contest) => {
    return acc + (contest.participationStatus === 'Participated' ? 24 : 0) + (contest.status === 'Completed' ? 42 : 0);
  }, 84);

  const calculatedParticipationRate = totalContests
    ? Math.min(100, Math.round((totalParticipants / Math.max(1, totalContests * 40)) * 1000) / 10)
    : 0;

  const performanceMetrics = [
    { label: 'Data Structures & Algorithms', value: 82, color: 'var(--primary)' },
    { label: 'Database Management Systems', value: 76, color: 'var(--success)' },
    { label: 'Web Development', value: 91, color: 'var(--warning)' },
    { label: 'Computer Networks', value: 85, color: 'var(--danger)' },
  ];

  return (
    <div className="page-container animate-fade-in" style={{ padding: '32px 40px' }}>
      <div className="welcome-banner" style={{ marginBottom: '32px' }}>
        <span className="welcome-badge">🏫 Faculty Workspace</span>
        <h2 className="welcome-title">Welcome back, Dr. Anirban Sen!</h2>
        <p className="welcome-subtitle">UIT • Department of Computer Science • Associate Professor</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Contests</span>
            <span className="stat-val">{totalContests}</span>
          </div>
        </div>

        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Contests</span>
            <span className="stat-val">{activeContests}</span>
          </div>
        </div>

        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Participants</span>
            <span className="stat-val">{totalParticipants}</span>
          </div>
        </div>

        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Participation Rate</span>
            <span className="stat-val">{calculatedParticipationRate}%</span>
            <span style={{ marginTop: '8px', display: 'inline-block', padding: '6px 10px', borderRadius: '999px', backgroundColor: 'rgba(56, 178, 85, 0.12)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700' }}>
              +4.2% vs last month
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        <div className="glass-card widget-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
            <h3 className="widget-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '750' }}>
              Contest Performance Analytics
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {performanceMetrics.map((metric) => (
              <div key={metric.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{metric.label}</span>
                  <span style={{ color: metric.color }}>{metric.value}% Average</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${metric.value}%`, height: '100%', backgroundColor: metric.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card widget-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <h3 className="widget-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '750' }}>
              Quick Contest Shortcuts
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage('create-contest')}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>Create New Contest</span>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage('manage-contests')}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <span>Manage Existing Contests</span>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage('faculty-results')}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <span>View Student Results & Statistics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
