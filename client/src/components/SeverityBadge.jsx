import React from 'react';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    className: 'badge-critical',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
      </svg>
    )
  },
  high: {
    label: 'High',
    className: 'badge-high',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  },
  medium: {
    label: 'Medium',
    className: 'badge-medium',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    )
  },
  low: {
    label: 'Low',
    className: 'badge-low',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    )
  },
  info: {
    label: 'Info',
    className: 'badge-info',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    )
  }
};

export const SeverityBadge = ({ severity = 'info' }) => {
  const normalized = severity.toLowerCase();
  const config = SEVERITY_CONFIG[normalized] || SEVERITY_CONFIG.info;

  return (
    <span className={`badge ${config.className}`} role="status" aria-label={`Severity: ${config.label}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default SeverityBadge;
