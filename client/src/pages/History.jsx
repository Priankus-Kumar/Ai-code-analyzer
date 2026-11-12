import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAnalyses from '../hooks/useAnalyses.js';
import SeverityBadge from '../components/SeverityBadge.jsx';

export const History = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [deleting, setDeleting] = useState(false);

  const {
    analyses,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    removeAnalysis
  } = useAnalyses({ limit: 10 });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput || undefined });
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setSelectedLanguage(val);
    updateFilters({ language: val || undefined });
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setSelectedStatus(val);
    updateFilters({ status: val || undefined });
  };

  const handleSeverityChange = (e) => {
    const val = e.target.value;
    setSelectedSeverity(val);
    updateFilters({ severity: val || undefined });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedLanguage('');
    setSelectedStatus('');
    setSelectedSeverity('');
    updateFilters({
      search: undefined,
      language: undefined,
      status: undefined,
      severity: undefined,
      page: 1
    });
  };

  const confirmDelete = async (item) => {
    const title = item.title || 'Untitled Analysis';
    if (!window.confirm(`Delete "${title}"? This operation is irreversible.`)) return;

    setDeleting(true);
    await removeAnalysis(item._id);
    setDeleting(false);
  };

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1 className="history-title">Analysis History & Archive</h1>
          <p className="history-subtitle">
            All private code reviews executed on your account, sorted newest-first.
          </p>
        </div>
        <Link to="/analyze" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="filter-card glass-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by analysis title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div className="dropdown-filters">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="form-select filter-select"
            aria-label="Filter by language"
          >
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="sql">SQL</option>
          </select>

          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="form-select filter-select"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={handleSeverityChange}
            className="form-select filter-select"
            aria-label="Filter by severity"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>

          {(searchInput || selectedLanguage || selectedStatus || selectedSeverity) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm reset-btn"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Analyses Table / List */}
      {loading ? (
        <div className="loading-box glass-card">
          <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
          </svg>
          <span>Retrieving archived analyses...</span>
        </div>
      ) : analyses.length === 0 ? (
        <div className="empty-box glass-card">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h3 className="empty-title">No Reviews Found</h3>
          <p className="empty-desc">No code reviews match your current filter parameters.</p>
          <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="history-table-wrap glass-card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Title & Focus</th>
                <th>Language</th>
                <th>Quality Score</th>
                <th>Findings</th>
                <th>Status</th>
                <th>Date</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((item) => (
                <tr key={item._id} className="history-row">
                  <td className="td-title">
                    <Link to={`/analyses/${item._id}`} className="row-link">
                      <strong className="title-text">{item.title || 'Untitled Analysis'}</strong>
                      <span className="sub-focus">{item.focus} review</span>
                    </Link>
                  </td>
                  <td>
                    <span className="lang-pill">{item.language}</span>
                  </td>
                  <td>
                    {typeof item.qualityScore === 'number' ? (
                      <span className="score-pill">{item.qualityScore}/100</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="findings-count">
                      {item.findings?.length || 0} issues
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="td-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="td-actions">
                    <Link
                      to={`/analyses/${item._id}`}
                      className="btn btn-secondary btn-sm action-btn"
                      title="View report"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => confirmDelete(item)}
                      className="btn btn-danger btn-sm action-btn"
                      title="Delete review"
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total)
          </span>

          <div className="pagination-btns">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => updateFilters({ page: pagination.page - 1 })}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateFilters({ page: p })}
                  className={`btn btn-sm ${pagination.page === p ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => updateFilters({ page: pagination.page + 1 })}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style>{`
        .history-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .history-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .history-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .filter-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-form {
          display: flex;
          gap: 0.75rem;
        }
        .search-input-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-dim);
          pointer-events: none;
        }
        .search-input {
          padding-left: 2.75rem;
        }
        .dropdown-filters {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .filter-select {
          width: auto;
          min-width: 150px;
          padding: 0.5rem 0.85rem;
          font-size: 0.875rem;
        }
        .history-table-wrap {
          overflow-x: auto;
          border-radius: var(--radius-lg);
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.925rem;
        }
        .history-table th {
          padding: 1rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(15, 23, 42, 0.6);
        }
        .history-table td {
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-main);
        }
        .history-row:hover td {
          background: rgba(30, 41, 59, 0.4);
        }
        .row-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        .title-text {
          color: var(--text-main);
          font-size: 0.95rem;
          transition: color 0.15s ease;
        }
        .row-link:hover .title-text {
          color: #818cf8;
        }
        .sub-focus {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: capitalize;
        }
        .lang-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .score-pill {
          font-size: 0.85rem;
          font-weight: 700;
          color: #34d399;
        }
        .findings-count {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .status-pill {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .status-completed { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-processing { background: rgba(234, 179, 8, 0.15); color: #fde047; }
        .status-failed { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .td-date {
          font-size: 0.8rem;
          color: var(--text-dim);
          white-space: nowrap;
        }
        .td-actions {
          white-space: nowrap;
        }
        .action-btn {
          margin-right: 0.4rem;
        }
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .pagination-info {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .pagination-btns {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .loading-box, .empty-box {
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }
        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-main);
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
      `}</style>
    </div>
  );
};

export default History;
