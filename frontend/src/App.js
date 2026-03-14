import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Compass, LogOut, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // clear local storage and reset state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setShowProfileMenu(false);
  };

  if (isLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(31, 41, 55, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: {
              primary: '#58a6ff',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f85149',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="app">
        {isAuthenticated && (
          <nav className="navbar flex justify-between items-center">
            <div className="logo flex items-center gap-2" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#fff' }}>
              <Compass size={24} color="#58a6ff" /> ProjectPilot
            </div>
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `flex items-center gap-2${isActive ? ' nav-active' : ''}`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/projects"
                  className={({ isActive }) => `flex items-center gap-2${isActive ? ' nav-active' : ''}`}
                >
                  <FolderKanban size={18} /> Projects
                </NavLink>
              </li>
            </ul>
            <div className="user-menu" style={{ position: 'relative' }}>
              <button
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar">
                  {localStorage.getItem('user_name')?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="menu-overlay"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="profile-dropdown glass-panel">
                    <div className="profile-info">
                      <div className="profile-name">{localStorage.getItem('user_name')}</div>
                      <div className="profile-email">{localStorage.getItem('user_email')}</div>
                    </div>
                    <div className="menu-divider"></div>
                    <button onClick={handleLogout} className="menu-item logout">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </nav>
        )}

        <div className="main-content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:projectId/issues" element={<IssueList />} />
                <Route path="/issues/:issueId" element={<IssueDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// export main app
export default App;
