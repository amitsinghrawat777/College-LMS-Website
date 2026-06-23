import React, { useState } from 'react';
import { Award, Trophy, Download, CheckCircle, Search, Users } from 'lucide-react';

export default function FacultyResults({ contests, triggerNotification }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Mock global leaderboard records
  const leaderboardData = [
    { rank: 1, name: 'Aditya Patel', id: '23210101155', contest: 'Weekly Contest 507', score: 92, percentage: '92%', solved: 5, status: 'Completed' },
    { rank: 2, name: 'Aarav Sharma', id: '23210101150', contest: 'Weekly Contest 507', score: 85, percentage: '85%', solved: 4, status: 'Completed' },
    { rank: 3, name: 'Kunal Verma', id: '23210101152', contest: 'Weekly Contest 506', score: 80, percentage: '80%', solved: 4, status: 'Completed' },
    { rank: 4, name: 'Riya Singhal', id: '23210101159', contest: 'Weekly Contest 506', score: 78, percentage: '78%', solved: 3, status: 'Completed' },
    { rank: 5, name: 'Neha Gupta', id: '23210101160', contest: 'Weekly Contest 507', score: 0, percentage: '0%', solved: 0, status: 'Terminated (UFM)' }
  ];

  const handlePublishResults = () => {
    setIsPublished(true);
    triggerNotification('success', 'Contest results have been published globally! Students can now access their final scorecard in their dashboards. 📣');
  };

  const handleDownloadReport = () => {
    // Generate CSV contents
    let csvContent = 'Rank,Student Name,College ID,Contest,Score,Percentage,Solved,Status\n';
    leaderboardData.forEach(row => {
      csvContent += `${row.rank},"${row.name}",${row.id},"${row.contest}",${row.score},${row.percentage},${row.solved},${row.status}\n`;
    });

    // Create a client-side downloadable file blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'college_contest_results_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification('success', 'CSV results report download initiated successfully. 📥');
  };

  const filteredLeaderboard = leaderboardData.filter(row => {
    return row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           row.id.includes(searchTerm) ||
           row.contest.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-container animate-fade-in" style={{ padding: '32px 40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '850', color: 'var(--logo-title-color)', letterSpacing: '-0.02em', margin: 0 }}>
            Contest Results & Performance
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Publish grading scorecards, download class performance metrics, and review the global rankings leaderboard.
          </p>
        </div>

        {/* Global Toolbar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadReport}
            className="btn btn-outline"
            style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Download size={16} />
            <span>Download CSV Report</span>
          </button>
          
          <button
            onClick={handlePublishResults}
            disabled={isPublished}
            className="btn btn-primary"
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: isPublished ? 'var(--success)' : 'var(--primary)',
              borderColor: isPublished ? 'var(--success)' : 'var(--primary)'
            }}
          >
            <CheckCircle size={16} />
            <span>{isPublished ? 'Results Published' : 'Publish Results'}</span>
          </button>
        </div>
      </div>

      {/* Leaderboard panel */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '750', color: 'var(--text-primary)' }}>
              Global CSE Participant Leaderboard
            </h3>
          </div>

          {/* Search leaderboards */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by student name or contest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Results table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Rank</th>
                <th style={{ padding: '12px 16px' }}>Student Name</th>
                <th style={{ padding: '12px 16px' }}>College ID</th>
                <th style={{ padding: '12px 16px' }}>Contest Name</th>
                <th style={{ padding: '12px 16px' }}>Score</th>
                <th style={{ padding: '12px 16px' }}>Percentage</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((row) => (
                <tr 
                  key={row.rank} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    backgroundColor: row.name === 'Aarav Sharma' ? 'var(--primary-light)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>#{row.rank}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '750' }}>{row.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{row.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.contest}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: row.score > 50 ? 'var(--success)' : row.score === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {row.score}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{row.percentage}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: row.status.startsWith('Completed') ? 'var(--success)' : 'var(--danger)',
                      backgroundColor: row.status.startsWith('Completed') ? 'var(--success-light)' : 'var(--danger-light)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
