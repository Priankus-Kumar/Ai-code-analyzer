import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export const App = () => {
  const footerBadges = ['AI Output Advisory Only', 'Strict AST Data Isolation'];

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <footer className="app-footer">
            <div className="footer-inner">
              <div className="footer-left">
                <span className="footer-brand">AI Agile Code Analyzer</span>
                <span className="footer-copy">
                  © {new Date().getFullYear()} Enterprise MERN + Google Gemini. All rights reserved.
                </span>
              </div>
              <div className="footer-right">
                {footerBadges.map((badge) => (
                  <span key={badge} className="footer-badge">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>

      <style>{`
        .app-footer {
          border-top: 1px solid var(--border-subtle);
          background: rgba(247, 246, 242, 0.96);
          padding: 1.5rem 1rem;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-dim);
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .footer-brand {
          font-weight: 600;
          color: var(--text-muted);
        }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .footer-badge {
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          background: rgba(68, 64, 60, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-dim);
        }
      `}</style>
    </BrowserRouter>
  );
};

export default App;
