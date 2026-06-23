import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Menu, BookOpen, ChevronDown } from 'lucide-react';
import { studentProfile } from '../data/mockData';

export default function Header({ currentUser, theme, toggleTheme, setMobileOpen, triggerNotification }) {
  const dashboardTitle = currentUser?.role === 'faculty' ? 'Faculty Dashboard' : 'Student Dashboard';

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={() => setMobileOpen(prev => !prev)}>
          <Menu size={20} />
        </button>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={24} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--logo-title-color)', fontFamily: 'var(--font-sans)' }}>
            University Platform
          </span>
          <span style={{ margin: '0 8px', color: 'var(--text-tertiary)', fontSize: '1.25rem' }}>|</span>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {dashboardTitle}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Icon */}
        <button 
          className="icon-btn" 
          title="Notifications"
          onClick={() => triggerNotification('info', 'No new notifications. You are all caught up!')}
        >
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>

        {/* User Profile */}
        <div className="user-profile" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={currentUser?.avatar || studentProfile.avatar} alt={currentUser?.name || studentProfile.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{currentUser?.name || studentProfile.name}</span>
            <span className="user-role">{currentUser?.role === 'faculty' ? 'Faculty' : studentProfile.role}</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </header>
  );
}

