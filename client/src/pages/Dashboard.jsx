import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import analysisService from '../services/analysisService.js';
import SeverityBadge from '../components/SeverityBadge.jsx';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgScore: null,
    totalFindings: 0,
    criticalCount: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const data = await analysisService.getAnalyses({ limit: 5 });
        const list = data.analyses || [];
        setRecentAnalyses(list);

        const total = data.pagination?.total || list.length;
        const scores = list.filter((a) => typeof a.qualityScore === 'number').map((a) => a.qualityScore);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

        let totalFindings = 0;
        let criticalCount = 0;

        list.forEach((a) => {
          if (Array.isArray(a.findings)) {
            totalFindings += a.findings.length;
            criticalCount += a.findings.filter((f) => f.severity === 'critical' || f.severity === 'high').length;
          }
        });

        setStats({
          total,
          avgScore,
          totalFindings,
          criticalCount
        });
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, <span className="welcome-name">{user?.name}</span> 👋
          </h1>
          <p className="welcome-subtitle">
            Your agile code health workspace is ready. Monitor metrics, run new AI scans, and track sprint backlog items.
          </p>
        </div>
        <Link to="/analyze" className="btn btn-primary btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Analyze Code</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid grid-4">
        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Total Analyses</span>
            <div className="stat-icon icon-indigo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <span className="stat-sub">Across all supported languages</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Avg Quality Score</span>
            <div className="stat-icon icon-emerald">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          <div className="stat-value">
            {stats.avgScore !== null ? `${stats.avgScore}/100` : 'N/A'}
          </div>
          <span className="stat-sub">Based on recent completed reviews</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Observations Found</span>
            <div className="stat-icon icon-cyan">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.totalFindings}</div>
          <span className="stat-sub">Actionable improvements</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Critical & High</span>
            <div className="stat-icon icon-rose">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.criticalCount}</div>
          <span className="stat-sub">Requires priority sprint fix</span>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <section className="recent-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Code Reviews</h2>
            <p className="section-subtitle">Latest analyses performed on your workspace</p>
          </div>
          <Link to="/history" className="btn btn-secondary btn-sm">
            <span>View Full History</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="loading-state glass-card">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
            </svg>
            <span>Loading workspace metrics...</span>
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3 className="empty-title">No Code Analyses Yet</h3>
            <p className="empty-desc">
              Submit your first snippet or module to receive an in-depth AI review and agile task breakdown.
            </p>
            <Link to="/analyze" className="btn btn-primary">
              Run First Analysis
            </Link>
          </div>
        ) : (
          <div className="analyses-list">
            {recentAnalyses.map((item) => (
              <Link
                key={item._id}
                to={`/analyses/${item._id}`}
                className="analysis-row-card glass-card"
              >
                <div className="row-main">
                  <div className="row-title-wrap">
                    <h3 className="row-title">{item.title || 'Untitled Analysis'}</h3>
                    <span className="lang-pill">{item.language}</span>
                    <span className="focus-pill">{item.focus}</span>
                  </div>
                  <p className="row-summary">
                    {item.summary || (item.status === 'processing' ? 'Analysis currently in progress...' : 'Analysis completed.')}
                  </p>
                  <div className="row-meta">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.findings?.length || 0} findings</span>
                    {item.durationMs > 0 && (
                      <>
                        <span>•</span>
                        <span>{item.durationMs}ms</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="row-end">
                  {typeof item.qualityScore === 'number' && (
                    <div className="score-badge">
                      <span className="score-num">{item.qualityScore}</span>
                      <span className="score-label">Score</span>
                    </div>
                  )}

                  <span className={`status-tag status-${item.status}`}>
                    {item.status}
                  </span>

                  <div className="arrow-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2.25rem;
          background: linear-gradient(120deg, #ffffff 0%, #f5f3ff 100%);
          border: 1px solid rgba(79, 70, 229, 0.16);
          box-shadow: 0 12px 30px rgba(41, 37, 36, 0.06);
          gap: 1.5rem;
        }
        .welcome-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }
        .welcome-name {
          color: #4f46e5;
        }
        .welcome-subtitle {
          color: #57534e;
          font-size: 0.95rem;
          max-width: 600px;
          line-height: 1.65;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .stat-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .icon-cyan { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
        .icon-rose { background: rgba(244, 63, 94, 0.15); color: #fb7185; }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .recent-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .section-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .analyses-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .analysis-row-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .analysis-row-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(30, 41, 59, 0.7);
        }
        .row-main {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .row-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .row-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .lang-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-sm);
        }
        .focus-pill {
          font-size: 0.72rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-sm);
          text-transform: capitalize;
        }
        .row-summary {
          font-size: 0.875rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .row-meta {
          font-size: 0.75rem;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .row-end {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.25rem 0.65rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
        }
        .score-num {
          font-size: 1.15rem;
          font-weight: 700;
          color: #34d399;
          line-height: 1;
        }
        .score-label {
          font-size: 0.65rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .status-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .status-completed { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-processing { background: rgba(234, 179, 8, 0.15); color: #fde047; }
        .status-failed { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .arrow-icon {
          color: var(--text-dim);
        }
        .empty-state {
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon {
          color: var(--text-dim);
          margin-bottom: 1rem;
        }
        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.4rem;
        }
        .empty-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 440px;
          margin-bottom: 1.5rem;
        }
        .loading-state {
          padding: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .analysis-row-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .row-end {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
