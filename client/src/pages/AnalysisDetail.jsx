import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import analysisService from '../services/analysisService.js';
import FindingCard from '../components/FindingCard.jsx';
import Loader from '../components/Loader.jsx';

const AgileTasksModal = lazy(() => import('../components/AgileTasksModal.jsx'));

export const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals & UI states
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showRawCode, setShowRawCode] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const data = await analysisService.getAnalysisById(id);
        const analysisData = data?.analysis || data;
        setAnalysis(analysisData);
      } catch (err) {
        setError(err.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  const handleStatusChange = useCallback(async (findingId, newStatus) => {
    try {
      await analysisService.updateFindingStatus(id, findingId, newStatus);
      // Update local finding status
      setAnalysis((prev) => {
        if (!prev) return prev;
        const updatedFindings = prev.findings.map((f) =>
          f._id === findingId ? { ...f, status: newStatus } : f
        );
        return { ...prev, findings: updatedFindings };
      });
    } catch (err) {
      console.error('Failed to update finding status:', err);
    }
  }, [id]);

  const handleDelete = async () => {
    const title = analysis.title || 'Untitled Analysis';
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;

    setDeleting(true);
    try {
      await analysisService.deleteAnalysis(id);
      navigate('/history');
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const findings = analysis?.findings || [];
  const filteredFindings = useMemo(
    () => findings.filter((finding) => {
      const matchesSeverity = severityFilter === 'all' || finding.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || finding.category === categoryFilter;
      return matchesSeverity && matchesCategory;
    }),
    [findings, severityFilter, categoryFilter]
  );
  const counts = useMemo(
    () => findings.reduce((totals, finding) => {
      if (Object.hasOwn(totals, finding.severity)) {
        totals[finding.severity] += 1;
      }
      return totals;
    }, { critical: 0, high: 0, medium: 0, low: 0, info: 0 }),
    [findings]
  );

  if (loading) {
    return <Loader message="Loading code review report..." />;
  }

  if (error || !analysis) {
    return (
      <div className="error-container glass-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 className="error-title">Report Unavailable</h2>
        <p className="error-desc">{error || 'The requested analysis report was not found.'}</p>
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const score = analysis.qualityScore;
  const scoreColor =
    score >= 80 ? 'var(--accent-emerald)' : score >= 60 ? 'var(--accent-amber)' : 'var(--sev-critical)';

  return (
    <div className="detail-page">
      {/* Top Breadcrumb & Controls */}
      <div className="top-bar">
        <div className="nav-breadcrumb">
          <Link to="/dashboard" className="crumb-link">Dashboard</Link>
          <span className="crumb-sep">/</span>
          <Link to="/history" className="crumb-link">History</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{analysis.title || 'Analysis Report'}</span>
        </div>

        <div className="top-actions">
          <button
            onClick={() => setIsTasksModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <span>Agile Sprint Tasks ({analysis.agileTasks?.totalTasks || findings.length})</span>
          </button>

          <button
            onClick={() => setShowRawCode(!showRawCode)}
            className="btn btn-secondary btn-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>{showRawCode ? 'Hide Source' : 'View Source'}</span>
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-danger btn-sm"
            title="Delete this analysis report"
            disabled={deleting}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="overview-card glass-card">
        <div className="overview-left">
          <div className="title-row">
            <h1 className="report-title">{analysis.title || 'Untitled Code Analysis'}</h1>
            <span className="lang-badge">{analysis.language}</span>
            <span className="focus-badge">{analysis.focus}</span>
            <span className={`status-pill status-${analysis.status}`}>{analysis.status}</span>
          </div>

          <p className="report-summary">{analysis.summary || 'Analysis completed.'}</p>

          <div className="report-meta-row">
            <span>Model: <strong>{analysis.model || 'Google Gemini'}</strong></span>
            <span>•</span>
            <span>Duration: <strong>{analysis.durationMs}ms</strong></span>
            <span>•</span>
            <span>Timestamp: <strong>{new Date(analysis.createdAt).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Quality Score Gauge */}
        {typeof score === 'number' && (
          <div className="score-gauge-wrap">
            <div className="gauge-circle" style={{ borderColor: scoreColor }}>
              <span className="gauge-num" style={{ color: scoreColor }}>
                {score}
              </span>
              <span className="gauge-max">/100</span>
            </div>
            <span className="gauge-label">Quality Score</span>
          </div>
        )}
      </div>

      {/* Failure Alert Banner */}
      {analysis.status === 'failed' && (
        <div className="alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Analysis Did Not Complete</strong>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                This code review could not be completed by the AI engine (Reason: {analysis.errorCode || 'Processing Error'}).
              </p>
            </div>
          </div>
          <Link to="/analyze" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
            Try New Analysis
          </Link>
        </div>
      )}

      {/* Advisory Notice */}
      <div className="advisory-pill glass-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>
          <strong>Advisory Notice:</strong> AI-generated findings are recommendations for architectural optimization and bug prevention. Review all suggestions manually before applying code changes.
        </span>
      </div>

      {/* Collapsible Source Code View */}
      {showRawCode && analysis.sourceCode && (
        <div className="source-viewer glass-card">
          <div className="viewer-header">
            <span>Submitted Source Code ({analysis.language})</span>
            <button
              onClick={() => navigator.clipboard.writeText(analysis.sourceCode)}
              className="btn btn-secondary btn-sm"
            >
              Copy Source
            </button>
          </div>
          <pre className="code-viewer-block">
            <code>{analysis.sourceCode}</code>
          </pre>
        </div>
      )}

      {/* Findings Filter & Heading Bar */}
      <div className="findings-section-head">
        <div className="section-title-wrap">
          <h2 className="findings-title">
            Identified Findings ({filteredFindings.length} of {findings.length})
          </h2>
          <div className="sev-counts">
            {counts.critical > 0 && <span className="count-pill pill-crit">{counts.critical} Critical</span>}
            {counts.high > 0 && <span className="count-pill pill-high">{counts.high} High</span>}
            {counts.medium > 0 && <span className="count-pill pill-med">{counts.medium} Med</span>}
            {counts.low > 0 && <span className="count-pill pill-low">{counts.low} Low</span>}
          </div>
        </div>

        <div className="filters-row">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="filter-select"
            aria-label="Filter findings by severity"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
            aria-label="Filter findings by category"
          >
            <option value="all">All Categories</option>
            <option value="security">Security</option>
            <option value="bug">Bugs</option>
            <option value="performance">Performance</option>
            <option value="readability">Readability</option>
            <option value="maintainability">Maintainability</option>
            <option value="testing">Testing</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="findings-list">
        {filteredFindings.length === 0 ? (
          <div className="empty-findings glass-card">
            <p>No findings matched the selected severity and category filters.</p>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <FindingCard
              key={finding._id}
              finding={finding}
              language={analysis.language}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* Agile Tasks Modal */}
      {isTasksModalOpen && (
        <Suspense fallback={null}>
          <AgileTasksModal
            isOpen={isTasksModalOpen}
            onClose={() => setIsTasksModalOpen(false)}
            agileTasks={analysis.agileTasks}
            language={analysis.language}
          />
        </Suspense>
      )}

      <style>{`
        .detail-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .nav-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .crumb-link {
          color: var(--text-muted);
        }
        .crumb-link:hover {
          color: var(--text-main);
        }
        .crumb-sep {
          opacity: 0.4;
        }
        .crumb-current {
          color: var(--text-main);
          font-weight: 500;
        }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .overview-card {
          padding: 2rem 2.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          border-color: rgba(68, 64, 60, 0.16);
        }
        .overview-left {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .report-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .lang-badge {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background: #eef2ff;
          color: #4338ca;
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .focus-badge {
          font-size: 0.75rem;
          background: #f5f5f4;
          color: var(--text-muted);
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-sm);
          text-transform: capitalize;
        }
        .status-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .status-completed { background: #d1fae5; color: #047857; }
        .status-processing { background: #fef3c7; color: #92400e; }
        .status-failed { background: #fee2e2; color: #b91c1c; }
        .report-summary {
          font-size: 1.05rem;
          color: var(--text-main);
          line-height: 1.6;
        }
        .report-meta-row {
          font-size: 0.8rem;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .report-meta-row strong {
          color: var(--text-muted);
        }
        .score-gauge-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .gauge-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 4px solid var(--accent-emerald);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.2);
        }
        .gauge-num {
          font-size: 1.9rem;
          font-weight: 800;
        }
        .gauge-max {
          font-size: 0.85rem;
          color: var(--text-dim);
        }
        .gauge-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .advisory-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.85rem;
          color: #78350f;
          background: #fffbeb;
          border: 1px solid #fcd34d;
        }
        .source-viewer {
          padding: 1.25rem;
        }
        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .code-viewer-block {
          background: #1c1917;
          color: #f5f5f4;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.6;
          max-height: 380px;
        }
        .findings-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .findings-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .sev-counts {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .count-pill {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }
        .pill-crit { background: var(--sev-critical-bg); color: #b91c1c; }
        .pill-high { background: var(--sev-high-bg); color: #c2410c; }
        .pill-med { background: var(--sev-medium-bg); color: #92400e; }
        .pill-low { background: var(--sev-low-bg); color: #1d4ed8; }
        .filters-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .filter-select {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-size: 0.85rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
        }
        .filter-select:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .empty-findings {
          padding: 2.5rem;
          text-align: center;
          color: var(--text-muted);
        }
        .delete-modal {
          max-width: 440px;
          width: 100%;
          padding: 2rem;
          background: var(--bg-secondary);
          border: 1px solid rgba(239, 68, 68, 0.4);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
        .delete-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .delete-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .delete-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .overview-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .findings-section-head {
            flex-direction: column;
            align-items: flex-start;
          }
          .filters-row {
            width: 100%;
          }
          .filter-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisDetail;
