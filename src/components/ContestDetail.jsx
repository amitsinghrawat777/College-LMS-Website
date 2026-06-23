import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, AlertTriangle, ArrowLeft, CheckSquare, ShieldAlert, Award, FileText, Play } from 'lucide-react';
import { contestsData } from '../data/mockData';

export default function ContestDetail({ contests, activeContestId, setCurrentPage, triggerNotification }) {
  const [agreed, setAgreed] = useState(false);

  // Find contest data
  const contest = contests.find(c => c.id === activeContestId) || contests[0];

  const handleStartExam = () => {
    if (!agreed) {
      triggerNotification('danger', 'You must agree to all contest rules before starting.');
      return;
    }
    // Proceed to active exam environment
    setCurrentPage('active-contest');
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Back button */}
      <button 
        className="btn btn-outline" 
        onClick={() => setCurrentPage('contests')} 
        style={{ marginBottom: '24px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Contests</span>
      </button>

      <div className="detail-layout">
        {/* Left Side: Rules and Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {contest.subject}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '850', color: 'var(--text-primary)', marginTop: '4px' }}>
                {contest.title}
              </h2>
            </div>
            
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {contest.description}
            </p>

            {/* Exam Information Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '12px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} style={{ color: 'var(--primary)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Exam Duration</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{contest.duration}</span>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={20} style={{ color: 'var(--accent-purple)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Total Marks</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{contest.totalMarks} Marks</span>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={20} style={{ color: 'var(--success)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Total Questions</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{contest.totalQuestions} Questions</span>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={20} style={{ color: 'var(--warning)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Passing Criteria</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{contest.passingCriteria}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} style={{ color: 'var(--danger)' }} />
              <span>Proctored Assessment Rules</span>
            </h3>

            <div className="rules-card">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <AlertTriangle size={18} style={{ color: 'var(--accent-orange)' }} />
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Important: Continuous UFM Monitoring is Active</span>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '6px', opacity: 0.9 }}>
                Our automated proctoring agent will monitor screen activities and inputs. Violations are logged immediately.
              </p>
            </div>

            <ul className="rules-list">
              <li className="rule-item">
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '50%', marginTop: '8px', minWidth: '6px' }} />
                <span><strong>Mandatory Fullscreen Mode:</strong> Exiting fullscreen mode once the contest starts triggers a warning violation.</span>
              </li>
              <li className="rule-item">
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '50%', marginTop: '8px', minWidth: '6px' }} />
                <span><strong>Window / Tab Tracking:</strong> Switching tabs, opening external tools, or minimizing the browser screen registers as cheating attempts.</span>
              </li>
              <li className="rule-item">
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '50%', marginTop: '8px', minWidth: '6px' }} />
                <span><strong>Clipboard Action Intercepts:</strong> Copy, cut, and paste interactions are programmatically disabled inside the workspace.</span>
              </li>
              <li className="rule-item">
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '50%', marginTop: '8px', minWidth: '6px' }} />
                <span><strong>Maximum 2 Violations Allowed:</strong> First violation logs a warning popup. Second violation terminates the exam session instantly.</span>
              </li>
              <li className="rule-item">
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '50%', marginTop: '8px', minWidth: '6px' }} />
                <span><strong>No Re-entry:</strong> Once disqualified or forced out of an active session, you cannot re-register or rejoin.</span>
              </li>
            </ul>

            {/* Checkbox agreement */}
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <span>I have read and agree to all the above rules and consent to automated proctoring.</span>
            </label>
          </div>

        </div>

        {/* Right Side: Faculty Onboarding widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              Examiner Profile
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}
              >
                {contest.faculty.charAt(4)}
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{contest.faculty}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Department Head</span>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Schedule Details:</strong>
                <span>Open from: {contest.startTime}</span>
                <span style={{ display: 'block' }}>Closing date: {contest.endTime}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Exam Policy:</strong>
                <span>Single attempt only. Questions are randomized. Marks are weight-scaled.</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Session Setup</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ensure your network is stable and external browser notifications are muted before initializing the workspace.
            </p>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px' }}
              disabled={!agreed}
              onClick={handleStartExam}
            >
              <Play size={16} fill="currentColor" />
              <span>Start Assessment</span>
            </button>
            
            {!agreed && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', textAlign: 'center', display: 'block' }}>
                * Accept rules checkbox to unlock the assessment.
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
