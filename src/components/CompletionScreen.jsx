import React, { useEffect, useRef } from 'react';
import { Check, Calendar, Clock, BarChart, ArrowRight, ExternalLink } from 'lucide-react';

export default function CompletionScreen({ submissionDetails, setCurrentPage }) {
  const canvasRef = useRef(null);

  // Confetti Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Confetti particles configuration
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        d: Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        // Draw particle
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        // Recycle particles when they fall off screen
        if (p.y > height) {
          particles[idx] = {
            x: Math.random() * width,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle
          };
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const details = submissionDetails || {
    contestTitle: "Weekly Contest 507",
    subjectName: "Data Structures & Algorithms",
    questionsAnswered: 5,
    totalQuestions: 5,
    submissionTime: new Date().toLocaleTimeString(),
    status: "Awaiting Result Publication",
    scorePercentage: 100,
    scoreString: "5/5"
  };

  return (
    <div className="completion-container animate-fade-in">
      {/* Canvas for Confetti */}
      <canvas ref={canvasRef} className="confetti-canvas" />

      <div className="glass-card success-card" style={{ zIndex: 10 }}>
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <Check size={44} strokeWidth={3} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Contest Submitted Successfully
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
          Your responses have been securely synced and recorded on the assessment server.
        </p>

        {/* Completion Metadata details */}
        <div className="completion-time-table">
          <div className="time-table-row">
            <span className="time-table-label">Assessment Title</span>
            <span className="time-table-val">{details.contestTitle}</span>
          </div>
          <div className="time-table-row">
            <span className="time-table-label">Subject</span>
            <span className="time-table-val">{details.subjectName}</span>
          </div>
          <div className="time-table-row">
            <span className="time-table-label">Submission Time</span>
            <span className="time-table-val">{details.submissionTime}</span>
          </div>
          <div className="time-table-row">
            <span className="time-table-label">Questions Checked</span>
            <span className="time-table-val">{details.questionsAnswered} / {details.totalQuestions} Questions</span>
          </div>
          <div className="time-table-row">
            <span className="time-table-label">Evaluation Status</span>
            <span className="time-table-val" style={{ color: 'var(--warning)', fontWeight: '700' }}>
              {details.status}
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div 
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            padding: '16px', 
            borderRadius: '12px', 
            width: '100%', 
            textAlign: 'left',
            marginBottom: '28px',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
            What Happens Next?
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Faculty will review written submissions. Relational grading percentiles and scores will be updated on your Student Dashboard under the Completed Contests metric within 24-48 hours.
          </p>
        </div>

        {/* Actions Button */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button 
            className="btn btn-outline" 
            style={{ flex: 1 }}
            onClick={() => setCurrentPage('contests')}
          >
            <ExternalLink size={16} />
            <span>Browse Catalog</span>
          </button>
          
          <button 
            className="btn btn-primary" 
            style={{ flex: 1.5 }}
            onClick={() => setCurrentPage('dashboard')}
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
