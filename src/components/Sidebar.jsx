import React from 'react';
import { LayoutDashboard, Trophy, PanelLeftClose, PanelLeftOpen, PlusCircle, Settings, BarChart2, LogOut, Bell, User, ChevronRight } from 'lucide-react';

export default function Sidebar({ currentUser, onLogout, currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed, mobileOpen, setMobileOpen, triggerNotification }) {
  const isFaculty = currentUser?.role === 'faculty';

  const menuItems = isFaculty ? [
    { id: 'faculty-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-contest', label: 'Create Contest', icon: PlusCircle },
    { id: 'manage-contests', label: 'Manage Contests', icon: Settings },
    { id: 'faculty-results', label: 'Results', icon: BarChart2 }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contests', label: 'Contests', icon: Trophy }
  ];

  const quickActions = isFaculty ? [
    { id: 'quick-create', label: 'Create Contest', icon: PlusCircle, action: () => setCurrentPage('create-contest') },
    { id: 'quick-notifications', label: 'Notifications', icon: Bell, action: () => triggerNotification?.('info', 'No new notifications. You are all caught up!') },
    { id: 'quick-settings', label: 'Settings', icon: Settings, action: () => setCurrentPage('manage-contests') },
  ] : [
    { id: 'quick-dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => setCurrentPage('dashboard') },
    { id: 'quick-contests', label: 'Contests', icon: Trophy, action: () => setCurrentPage('contests') },
    { id: 'quick-notifications', label: 'Notifications', icon: Bell, action: () => triggerNotification?.('info', 'No new notifications. You are all caught up!') },
  ];

  const userName = currentUser?.name || 'Guest User';
  const userRole = currentUser?.role === 'faculty' ? 'Faculty' : 'Student';

  return (
    <>
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 99,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>

          {!sidebarCollapsed && (
            <div className="sidebar-brand">
              <div className="brand-icon" />
              <div>
                <span className="brand-title">University</span>
                <span className="brand-subtitle">Platform</span>
              </div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id ||
                (item.id === 'contests' && ['contest-detail', 'active-contest', 'contest-completed'].includes(currentPage)) ||
                (item.id === 'faculty-dashboard' && isFaculty && ['dashboard', 'faculty-dashboard'].includes(currentPage));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileOpen(false);
                  }}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-item-indicator" />
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-tooltip">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="sidebar-panel">
            <div className="quick-actions">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    className="quick-action-btn"
                    onClick={action.action}
                    aria-label={action.label}
                  >
                    <Icon size={18} />
                    <span className="quick-action-tooltip">{action.label}</span>
                  </button>
                );
              })}
            </div>

            <button className="nav-item logout-item" type="button" onClick={onLogout}>
              <LogOut className="nav-icon" />
              <span className="nav-label">Log Out</span>
              <span className="nav-tooltip">Log Out</span>
            </button>

            <div className="profile-card">
              <img src={currentUser?.avatar || ''} alt={userName} className="profile-avatar" />
              {!sidebarCollapsed ? (
                <div className="profile-info">
                  <span className="profile-name">{userName}</span>
                  <span className="profile-role">{userRole}</span>
                </div>
              ) : null}
              <div className="profile-hover-panel">
                <div>
                  <span className="profile-name">{userName}</span>
                  <span className="profile-role">{userRole}</span>
                </div>
                <button type="button" className="profile-logout" onClick={onLogout}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
      </aside>
    </>
  );
}
