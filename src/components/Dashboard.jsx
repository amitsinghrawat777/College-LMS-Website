import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Award, Flame, Zap, CheckCircle, Clock, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import { studentProfile, performanceData, contestsData } from '../data/mockData';

export default function Dashboard({ contests, setCurrentPage, setActiveContestId, triggerNotification }) {
  const { stats, name, branch, institution, year, streak, points, ranking, totalStudents } = studentProfile;
  const { scoreTrend, monthlyParticipation, recentActivity } = performanceData;

  // Find last completed contest using the new schema
  const completedContests = contests.filter(c => c.status === 'Completed' && c.participationStatus === 'Participated');
  const lastContest = completedContests[0];

  // Notification for streak
  const handleStreakClick = () => {
    triggerNotification('success', `Keep it up, Aarav! You are on a ${streak} days exam prep streak! 🔥`);
  };



  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="welcome-badge">⚡ Pro Student Badge</span>
            <h2 className="welcome-title">Welcome back, {name}!</h2>
            <p className="welcome-subtitle">{institution} • {branch} • {year}</p>
          </div>
          <button 
            className="streak-pill" 
            onClick={handleStreakClick} 
          >
            <Flame size={18} fill="currentColor" />
            <span>DAILY STREAK: {streak} DAYS</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Contests</span>
            <span className="stat-val">{stats.totalContests}</span>
          </div>
        </div>

        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Contests</span>
            <span className="stat-val">{stats.completedContests}</span>
          </div>
        </div>

        <div className="glass-card stat-card hover-effect">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Current Ranking</span>
            <span className="stat-val">#{stats.currentRanking} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-tertiary)' }}>/ {totalStudents}</span></span>
          </div>
        </div>
      </div>

      {/* Quick Overview Grid Layout */}
      <div className="dashboard-widgets-grid">
        
        {/* Last Contest Results Widget */}
        <div className="glass-card widget-card">
          <h3 className="widget-title">Last Contest Performance</h3>
          {lastContest ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{lastContest.title}</span>
                <span className="contest-tag easy">
                  {lastContest.performanceBadge || lastContest.difficulty || 'Completed'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '-6px' }}>{lastContest.subject}</p>
              
              <div className="widget-inner-row">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Obtained Score</span>
                <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--success)' }}>{lastContest.score}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No completed contests available.</p>
          )}
        </div>

        {/* Current Leaderboard Widget */}
        <div className="glass-card widget-card">
          <h3 className="widget-title">Leaderboard Standing</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="leaderboard-position">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trophy size={20} style={{ color: 'var(--warning)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Global Standing</span>
              </div>
              <span className="leaderboard-rank">#{ranking}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                <span>Percentile Position</span>
                <span>97.2%</span>
              </div>
              {/* ProgressBar */}
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '97.2%' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '4px' }}>
                Ranked in Top 3% among {totalStudents} CSE students
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
