import React, { useState } from 'react';
import SeverityBadge from './SeverityBadge.jsx';

const FindingCardComponent = ({ finding, onStatusChange, language = 'code' }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyCode = async () => {
    if (!finding.suggestedCode) return;
    try {
      await navigator.clipboard.writeText(finding.suggestedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lineLabel =
    finding.lineStart === finding.lineEnd
      ? `Line ${finding.lineStart}`
      : `Lines ${finding.lineStart} - ${finding.lineEnd}`;

  return (
    <article className={`finding-card glass-card status-${finding.status || 'open'}`}>
      {/* Header */}
      <header className="finding-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="finding-title-section">
          <button
            type="button"
            className="expand-toggle-btn"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse finding details' : 'Expand finding details'}
          >
            <svg
              className={`chevron-icon ${isExpanded ? 'open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <SeverityBadge severity={finding.severity} />

          <h3 className="finding-title">{finding.title}</h3>
        </div>

        <div className="finding-meta" onClick={(e) => e.stopPropagation()}>
          <span className="meta-tag lang-tag">
            {language}
          </span>

          <span className="meta-tag line-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            {lineLabel}
          </span>

          <span className="meta-tag category-tag">{finding.category}</span>

          <span className="meta-tag source-tag" title="Source of finding">
            <span className="source-dot"></span>
            {finding.source === 'ai' ? 'AI Review' : 'Static Analysis'}
          </span>

          {finding.confidence && (
            <span className="meta-tag confidence-tag" title="AI confidence score">
              {Math.round(finding.confidence * 100)}% Conf.
            </span>
          )}

          {/* Status Select */}
          {onStatusChange && (
            <select
              value={finding.status || 'open'}
              onChange={(e) => onStatusChange(finding._id, e.target.value)}
              className="status-selector"
              aria-label="Finding resolution status"
            >
              <option value="open">Open</option>
              <option value="accepted">Accepted</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          )}
        </div>
      </header>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="finding-body">
          {/* Description */}
          <div className="finding-section">
            <h4 className="section-heading">Description</h4>
            <p className="finding-description">{finding.description}</p>
          </div>

          {/* Evidence Snippet */}
          {finding.evidence && (
            <div className="finding-section">
              <h4 className="section-heading">Identified Code Evidence ({language})</h4>
              <pre className="code-block evidence-block">
                <code>{finding.evidence}</code>
              </pre>
            </div>
          )}

          {/* Actionable Recommendation */}
          {finding.recommendation && (
            <div className="finding-section">
              <h4 className="section-heading">Actionable Recommendation</h4>
              <div className="recommendation-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <p>{finding.recommendation}</p>
              </div>
            </div>
          )}

          {/* Suggested Code with 1-Click Copy */}
          {finding.suggestedCode && (
            <div className="finding-section">
              <div className="suggested-header">
                <h4 className="section-heading">Suggested Code Resolution ({language})</h4>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="btn btn-secondary btn-sm copy-btn"
                  title="Copy suggested code to clipboard"
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="code-block suggested-block">
                <div style={{ fontSize: '0.7rem', color: '#6ee7b7', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  {language}
                </div>
                <code>{finding.suggestedCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      <style>{`
        .finding-card {
          margin-bottom: 1.25rem;
          border-left: 4px solid var(--primary);
          overflow: hidden;
        }
        .finding-card.status-resolved {
          border-left-color: var(--accent-emerald);
          opacity: 0.85;
        }
        .finding-card.status-dismissed {
          border-left-color: var(--text-dim);
          opacity: 0.65;
        }
        .finding-header {
          padding: 1.15rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          cursor: pointer;
          user-select: none;
        }
        .finding-title-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .expand-toggle-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .chevron-icon {
          transition: transform 0.2s ease;
        }
        .chevron-icon.open {
          transform: rotate(180deg);
        }
        .finding-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .finding-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .meta-tag {
          font-size: 0.75rem;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          background: #f5f5f4;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .line-tag {
          color: #1d4ed8;
          background: #eff6ff;
        }
        .category-tag {
          text-transform: capitalize;
          color: #7e22ce;
          background: #faf5ff;
        }
        .source-tag {
          color: #0e7490;
          background: #ecfeff;
        }
        .source-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 6px var(--accent-cyan);
        }
        .status-selector {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-size: 0.8rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .status-selector:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .finding-body {
          padding: 0 1.5rem 1.5rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .finding-section {
          margin-top: 1rem;
        }
        .section-heading {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.4rem;
        }
        .finding-description {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.6;
        }
        .recommendation-box {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-md);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #065f46;
          font-size: 0.925rem;
        }
        .suggested-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }
        .code-block {
          background: #1c1917;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .evidence-block code {
          color: #fca5a5;
        }
        .suggested-block code {
          color: #6ee7b7;
        }
        @media (max-width: 768px) {
          .finding-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .finding-meta {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </article>
  );
};

export const FindingCard = React.memo(FindingCardComponent);

export default FindingCard;
