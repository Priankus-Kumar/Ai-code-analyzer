import React, { useState, useEffect } from 'react';

const ANALYSIS_STEPS = [
  'Sanitizing source code input...',
  'Parsing AST structure & syntax tree...',
  'Sending payload to Google Gemini AI backend...',
  'Evaluating security vulnerabilities & edge cases...',
  'Synthesizing agile sprint recommendations...',
  'Finalizing structured quality report...'
];

export const Loader = ({ message = 'Analyzing code...', showProgressStages = false }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!showProgressStages) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [showProgressStages]);

  const activeMessage = showProgressStages ? ANALYSIS_STEPS[currentStepIndex] : message;

  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-card glass-card">
        {/* Loading indicator */}
        <div className="radar-core">
          <div className="radar-center">
            <svg className="loader-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="loader-text-group">
          <h3 className="loader-title">Gemini AI Analysis in Progress</h3>
          <p className="loader-status">{activeMessage}</p>
        </div>

        {/* Progress Bar Animation */}
        <div className="loader-bar-track">
          <div className="loader-bar-indicator"></div>
        </div>

        <p className="loader-subtext">
          Treating code strictly as untrusted data with full AST isolation.
        </p>
      </div>

      <style>{`
        .loader-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          min-height: 55vh;
          width: 100%;
        }
        .loader-card {
          max-width: 560px;
          width: 100%;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-md);
        }
        .radar-core {
          position: relative;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .radar-center {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .loader-spinner {
          animation: spin 0.9s linear infinite;
        }
        .loader-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.4rem;
        }
        .loader-status {
          font-size: 0.925rem;
          color: var(--text-muted);
          min-height: 1.5rem;
          font-weight: 500;
        }
        .loader-bar-track {
          width: 100%;
          height: 5px;
          background: var(--bg-secondary);
          border-radius: var(--radius-full);
          margin: 1.5rem 0 1rem;
          overflow: hidden;
          position: relative;
        }
        .loader-bar-indicator {
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, #78716c, #292524);
          border-radius: var(--radius-full);
          position: absolute;
          animation: indeterminateTrack 1.8s ease-in-out infinite;
        }
        @keyframes indeterminateTrack {
          0% { left: -45%; }
          100% { left: 100%; }
        }
        .loader-subtext {
          font-size: 0.775rem;
          color: var(--text-dim);
        }
        @media (max-width: 480px) {
          .loader-card {
            padding: 2rem 1.25rem;
          }
          .loader-title {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
