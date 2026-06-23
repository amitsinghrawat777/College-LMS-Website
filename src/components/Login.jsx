import React, { useState } from 'react';
import { BookOpen, Lock, User, ArrowRight } from 'lucide-react';
import { studentProfile } from '../data/mockData';

export default function Login({ onLogin, triggerNotification }) {
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!collegeId.trim()) {
      newErrors.collegeId = 'College ID is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerNotification('danger', 'Please correct the validation errors.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate authentication lag
    setTimeout(() => {
      setIsLoading(false);
      
      const idPrefix = collegeId.trim();
      const firstChar = idPrefix.charAt(0);
      const isDigit = /^\d/.test(firstChar);

      if (isDigit) {
        // Log in as student
        const studentUser = {
          id: collegeId,
          role: 'student',
          name: studentProfile.name,
          avatar: studentProfile.avatar,
          profileDetails: studentProfile
        };
        onLogin(studentUser);
        triggerNotification('success', `Welcome back, Aarav! Logged in as Student. 🎓`);
      } else {
        // Log in as faculty
        const facultyUser = {
          id: collegeId,
          role: 'faculty',
          name: 'Dr. Anirban Sen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          profileDetails: {
            name: 'Dr. Anirban Sen',
            role: 'Associate Professor',
            branch: 'Computer Science',
            institution: 'UIT'
          }
        };
        onLogin(facultyUser);
        triggerNotification('success', `Welcome back, Dr. Sen! Logged in as Faculty. 🏫`);
      }
    }, 1000);
  };

  const handleForgotClick = (e) => {
    e.preventDefault();
    triggerNotification('info', 'Password recovery link has been sent to your registered institutional email ID. 📧');
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-primary)',
        fontFamily: 'var(--font-sans)',
        padding: '24px'
      }}
    >
      <div 
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          borderRadius: '24px',
          border: '1.5px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* College Logo Icon */}
        <div 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            border: '1.5px solid rgba(59, 130, 246, 0.15)'
          }}
        >
          <BookOpen size={28} />
        </div>

        {/* Platform Title */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: '850', color: 'var(--logo-title-color)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Campus Contest Portal
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '32px' }}>
          Log in with your academic credentials
        </p>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          
          {/* ID Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              College / institutional ID
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="e.g. 23210101150 or UU2321"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '12px',
                  border: errors.collegeId ? '1.5px solid var(--danger)' : '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            {errors.collegeId && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: '600' }}>{errors.collegeId}</span>
            )}
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <a 
                href="#forgot" 
                onClick={handleForgotClick}
                style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}
              >
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '12px',
                  border: errors.password ? '1.5px solid var(--danger)' : '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            {errors.password && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: '600' }}>{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s, transform 0.1s, opacity 0.2s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
              opacity: isLoading ? 0.8 : 1
            }}
          >
            {isLoading ? (
              <span className="spinner-small" style={{ borderTopColor: '#ffffff' }} />
            ) : (
              <>
                <span>Secure Log In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Small Tips Grid */}
        <div 
          style={{
            marginTop: '32px',
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1.5px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            textAlign: 'left',
            lineHeight: '1.4'
          }}
        >
          <span style={{ fontWeight: '700', display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>💡 Demo Credentials Quick-Tip:</span>
          • To enter as <strong>Student</strong>, use numeric ID starting with a digit (e.g. <code>23210101150</code>).<br />
          • To enter as <strong>Faculty</strong>, use alphanumeric ID starting with letters (e.g. <code>UU23210101250</code>).
        </div>
      </div>
    </div>
  );
}
