import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Menu, ChevronDown, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { studentProfile } from '../data/mockData';
import uuLogo from '../assets/uudoonlogo.png';

export default function Header({ 
  currentUser, 
  theme, 
  toggleTheme, 
  setMobileOpen, 
  triggerNotification,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const dashboardTitle = currentUser?.role === 'faculty' ? 'Faculty Dashboard' : 'Student Dashboard';

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile menu toggle */}
        <button className="menu-toggle-btn" onClick={() => setMobileOpen(prev => !prev)}>
          <Menu size={20} />
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button 
          className="sidebar-toggle-btn-desktop" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="logo-container">
          <img src={uuLogo} className="header-logo" alt="Uttaranchal University Logo" />
          <span className="header-brand-title">
            Uttaranchal University
          </span>
          <span className="header-divider">|</span>
          <span className="header-subtitle">
            {dashboardTitle}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications Icon */}
        <button 
          className="icon-btn" 
          title="Notifications"
          onClick={() => triggerNotification('info', 'No new notifications. You are all caught up!')}
        >
          <Bell size={16} />
          <span className="badge-dot"></span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <img src={currentUser?.avatar || studentProfile.avatar} alt={currentUser?.name || studentProfile.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{currentUser?.name || studentProfile.name}</span>
            <span className="user-role">{currentUser?.role === 'faculty' ? 'Faculty' : studentProfile.role}</span>
          </div>
          <ChevronDown size={12} className="nav-icon" />
        </div>
      </div>
    </header>
  );
}

