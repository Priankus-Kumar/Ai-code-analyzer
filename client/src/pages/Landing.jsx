import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="sparkle-icon">✨</span>
          <span>Powered by Google Gemini 1.5/2.0 Flash</span>
        </div>

        <h1 className="hero-headline">
          Elevate Code Quality with <span className="gradient-text">AI Agile Intelligence</span>
        </h1>

        <p className="hero-description">
          Automated multi-language code review, vulnerability detection, and instant sprint backlog generation. Transform messy code into clean, production-grade architecture in seconds.
        </p>

        <div className="hero-cta-group">
          <Link
            to={isAuthenticated ? '/analyze' : '/register'}
            className="btn btn-primary btn-lg"
          >
            <span>Launch Code Review</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          {!isAuthenticated && (
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Workspace
            </Link>
          )}
        </div>

        {/* Live Interactive Code Preview Mockup */}
        <div className="preview-container glass-card">
          <div className="preview-toolbar">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="preview-file-title">authMiddleware.js — Analyzed in 420ms</span>
            <span className="badge badge-success">Score: 94/100</span>
          </div>

          <div className="preview-split">
            <div className="preview-code-pane">
              <pre className="code-block">
                <code>{`// Authenticate Bearer JWT
export const verifyAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};`}</code>
              </pre>
            </div>
            <div className="preview-finding-pane">
              <div className="mini-finding-card">
                <div className="mini-finding-head">
                  <span className="badge badge-medium">Medium</span>
                  <span className="mini-tag">Security</span>
                </div>
                <h4 className="mini-title">Enforce Token Expiration Check</h4>
                <p className="mini-desc">
                  Ensure JWT expiration is strictly validated with bounded lifetime to mitigate replay attacks.
                </p>
                <div className="mini-task-btn">
                  <span>+ Convert to Sprint Task</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="features-section">
        <div className="section-title-wrap">
          <h2 className="section-title">Built for Modern High-Velocity Engineering Teams</h2>
          <p className="section-desc">
            Seamlessly bridge the gap between static code analysis and agile sprint planning.
          </p>
        </div>

        <div className="features-grid grid-3">
          <div className="feature-card glass-card">
            <div className="feature-icon icon-cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="feature-heading">Security & OWASP Auditing</h3>
            <p className="feature-body">
              Deep scans detect injection vulnerabilities, weak cryptography, exposed secrets, and unhandled exceptions with line-level accuracy.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3 className="feature-heading">Agile Sprint Backlog Generator</h3>
            <p className="feature-body">
              Zero-effort sprint planning: Automatically converts code findings into structured User Stories and Jira/Linear tasks with priority ratings and acceptance notes.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 className="feature-heading">14+ Languages Supported</h3>
            <p className="feature-body">
              First-class support for JavaScript, TypeScript, Python, Go, Rust, Java, C++, C#, SQL, Ruby, and modern frontend styling.
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Banner */}
      <section className="advisory-banner glass-card">
        <div className="advisory-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <h4 className="advisory-title">Advisory Notice & AI Disclosure</h4>
          <p className="advisory-text">
            All code reviews, scores, and suggested refactorings generated by Google Gemini are advisory recommendations. Submitted code is never executed and must be evaluated by human engineers prior to production deployment.
          </p>
        </div>
      </section>

      <style>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: 4.5rem;
          padding: 1rem 0 3rem 0;
        }
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 960px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.95rem;
          border-radius: var(--radius-full);
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .hero-headline {
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-description {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 720px;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }
        .preview-container {
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #090e1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2);
        }
        .preview-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid var(--border-subtle);
        }
        .preview-file-title {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        .preview-split {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          text-align: left;
        }
        .preview-code-pane {
          padding: 1.25rem;
          border-right: 1px solid var(--border-subtle);
          background: #060a12;
        }
        .preview-finding-pane {
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .mini-finding-card {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .mini-finding-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .mini-tag {
          font-size: 0.72rem;
          color: #c084fc;
        }
        .mini-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }
        .mini-desc {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }
        .mini-task-btn {
          font-size: 0.75rem;
          font-weight: 600;
          color: #818cf8;
          cursor: pointer;
        }
        .section-title-wrap {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .section-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
        }
        .feature-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-cyan {
          background: rgba(6, 182, 212, 0.15);
          color: var(--accent-cyan);
        }
        .icon-indigo {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        }
        .icon-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald);
        }
        .feature-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .feature-body {
          font-size: 0.925rem;
          color: var(--text-muted);
          line-height: 1.55;
        }
        .advisory-banner {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem 1.75rem;
          background: rgba(15, 23, 42, 0.6);
          border-left: 4px solid var(--accent-amber);
        }
        .advisory-icon {
          color: var(--accent-amber);
          margin-top: 0.15rem;
        }
        .advisory-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .advisory-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.25rem;
          }
          .preview-split {
            grid-template-columns: 1fr;
          }
          .preview-code-pane {
            border-right: none;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
