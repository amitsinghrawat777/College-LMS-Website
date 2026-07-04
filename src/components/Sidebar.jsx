import React from 'react';
import { LayoutDashboard, Trophy, PlusCircle, Settings, BarChart2, LogOut, Bell, User } from 'lucide-react';

export default function Sidebar({ currentUser, onLogout, currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed, mobileOpen, setMobileOpen, triggerNotification }) {
  const isFaculty = currentUser?.role === 'faculty';

  const menuSections = isFaculty ? [
    {
      title: 'Overview',
      items: [
        { id: 'faculty-dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Contest Creation',
      items: [
        { id: 'create-contest', label: 'Create Contest', icon: PlusCircle }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'manage-contests', label: 'Manage Contests', icon: Settings },
        { id: 'faculty-results', label: 'Results', icon: BarChart2 }
      ]
    }
  ] : [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Assessments',
      items: [
        { id: 'contests', label: 'Contests', icon: Trophy }
      ]
    }
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
            right: 55,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 99,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        <nav className="sidebar-nav">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {menuSections.map((section, secIdx) => (
              <div key={secIdx} className="nav-section-group">
                <span className="sidebar-section-label">{section.title}</span>
                <div className="nav-group">
                  {section.items.map((item) => {
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
              </div>
            ))}
          </div>

          <div className="sidebar-panel">


            <button className="nav-item logout-item" type="button" onClick={onLogout}>
              <LogOut className="nav-icon" />
              <span className="nav-label">Log Out</span>
              <span className="nav-tooltip">Log Out</span>
            </button>
          </div>
        </nav>

      </aside>
    </>
  );
}
