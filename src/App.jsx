import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Contests from './components/Contests';
import ContestDetail from './components/ContestDetail';
import ContestEnvironment from './components/ContestEnvironment';
import CompletionScreen from './components/CompletionScreen';
import Login from './components/Login';
import FacultyDashboard from './components/FacultyDashboard';
import FacultyCreateContest from './components/FacultyCreateContest';
import FacultyManageContest from './components/FacultyManageContest';
import FacultyResults from './components/FacultyResults';
import { contestsData } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [contests, setContests] = useState(contestsData);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeContestId, setActiveContestId] = useState('contest-507');
  const [theme, setTheme] = useState('light'); // Default to light theme
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage(user.role === 'faculty' ? 'faculty-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    triggerNotification('info', 'Logged out successfully. See you again!');
  };
  
  // Toast notifications list state
  const [toasts, setToasts] = useState([]);

  const triggerNotification = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync theme selection to document root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    triggerNotification('info', `Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`);
  };

  const renderActivePage = () => {
    switch (currentPage) {
      // Student Pages
      case 'dashboard':
        return (
          <Dashboard 
            contests={contests}
            setCurrentPage={setCurrentPage} 
            setActiveContestId={setActiveContestId}
            triggerNotification={triggerNotification} 
          />
        );
      case 'contests':
        return (
          <Contests 
            contests={contests}
            setContests={setContests}
            setCurrentPage={setCurrentPage} 
            setActiveContestId={setActiveContestId}
            triggerNotification={triggerNotification} 
          />
        );
      case 'contest-detail':
        return (
          <ContestDetail 
            contests={contests}
            activeContestId={activeContestId} 
            setCurrentPage={setCurrentPage} 
            triggerNotification={triggerNotification} 
          />
        );
      case 'contest-completed':
        return (
          <CompletionScreen 
            submissionDetails={submissionDetails} 
            setCurrentPage={setCurrentPage} 
          />
        );

      // Faculty Pages
      case 'faculty-dashboard':
        return (
          <FacultyDashboard 
            contests={contests}
            setCurrentPage={setCurrentPage} 
            triggerNotification={triggerNotification} 
          />
        );
      case 'create-contest':
        return (
          <FacultyCreateContest 
            setContests={setContests}
            setCurrentPage={setCurrentPage} 
            triggerNotification={triggerNotification} 
          />
        );
      case 'manage-contests':
        return (
          <FacultyManageContest 
            contests={contests}
            setContests={setContests}
            triggerNotification={triggerNotification} 
          />
        );
      case 'faculty-results':
        return (
          <FacultyResults 
            contests={contests}
            triggerNotification={triggerNotification} 
          />
        );

      default:
        return currentUser?.role === 'faculty' ? (
          <FacultyDashboard 
            contests={contests}
            setCurrentPage={setCurrentPage} 
            triggerNotification={triggerNotification} 
          />
        ) : (
          <Dashboard 
            contests={contests}
            setCurrentPage={setCurrentPage} 
            setActiveContestId={setActiveContestId}
            triggerNotification={triggerNotification} 
          />
        );
    }
  };

  // Auth gate: Login page is displayed if user is not authenticated
  if (!currentUser) {
    return (
      <div className={theme}>
        <Login onLogin={handleLogin} triggerNotification={triggerNotification} />
        {/* Toast Notification Container for Auth */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active testing environment should occupy the full screen without layout elements
  if (currentPage === 'active-contest') {
    return (
      <div className={theme}>
        <ContestEnvironment 
          contests={contests}
          setContests={setContests}
          activeContestId={activeContestId}
          setCurrentPage={setCurrentPage}
          setSubmissionDetails={setSubmissionDetails}
          triggerNotification={triggerNotification}
        />
        {/* Toast rendering inside environment */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      {/* Full-width Header */}
      <Header 
        currentUser={currentUser}
        theme={theme}
        toggleTheme={toggleTheme}
        setMobileOpen={setMobileOpen}
        triggerNotification={triggerNotification}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div style={{ display: 'flex', width: '100%', flex: 1, minHeight: 'calc(100vh - var(--header-height))' }}>
        {/* Sidebar Navigation */}
        <Sidebar 
          currentUser={currentUser}
          onLogout={handleLogout}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          triggerNotification={triggerNotification}
        />

        {/* Main Content Pane */}
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {renderActivePage()}
        </div>
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
