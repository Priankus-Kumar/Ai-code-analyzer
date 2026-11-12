export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'html',
  'css',
  'sql',
  'shell'
];

export const ANALYSIS_FOCUS_AREAS = [
  'general',
  'bugs',
  'security',
  'performance',
  'readability',
  'maintainability'
];

export const FINDING_CATEGORIES = [
  'bug',
  'security',
  'performance',
  'readability',
  'maintainability',
  'testing',
  'other'
];

export const SEVERITY_LEVELS = [
  'critical',
  'high',
  'medium',
  'low',
  'info'
];

export const FINDING_STATUSES = [
  'open',
  'accepted',
  'dismissed',
  'resolved'
];

export const ANALYSIS_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed'
];

export const USER_ROLES = [
  'user',
  'admin'
];

export const DEFAULT_LIMITS = {
  MIN_CODE_LENGTH: 5,
  MAX_CODE_LENGTH: 25000,
  MAX_TITLE_LENGTH: 120,
  MAX_FINDINGS: 30,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  AI_TIMEOUT_MS: 30000
};
