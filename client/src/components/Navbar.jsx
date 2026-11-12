import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span className="brand-text">
            Agile<span className="brand-highlight">AI</span> Analyzer
          </span>
          <span className="badge badge-info navbar-gemini-tag">Gemini</span>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/analyze"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                New Analysis
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                History
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Features
              </NavLink>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of your account"
                aria-label="Log out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          background: rgba(247, 246, 242, 0.96);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.5rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #57534e, #292524);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(41, 37, 36, 0.16);
        }
        .brand-text {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }
        .brand-highlight {
          color: #57534e;
          margin-left: 2px;
        }
        .navbar-gemini-tag {
          font-size: 0.65rem;
          padding: 0.15rem 0.45rem;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: var(--text-muted);
          font-size: 0.925rem;
          font-weight: 500;
          transition: color var(--transition-fast);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .nav-link:hover {
          color: var(--text-main);
        }
        .nav-link.active {
          color: #292524;
          background: rgba(68, 64, 60, 0.08);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .user-role {
          font-size: 0.72rem;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .guest-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .navbar-nav {
            display: none;
          }
          .user-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
