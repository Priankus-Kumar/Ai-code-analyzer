const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'cookie',
  'authorization',
  'apikey',
  'gemini_api_key',
  'ai_gemini_token_key',
  'sourcecode',
  'code'
];

function sanitize(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = sanitize(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = sanitize(meta);
  const metaString =
    Object.keys(sanitizedMeta).length > 0 ? ` ${JSON.stringify(sanitizedMeta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
}

export const logger = {
  info: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(formatLog('info', msg, meta));
    }
  },
  warn: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(formatLog('warn', msg, meta));
    }
  },
  error: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(formatLog('error', msg, meta));
    }
  },
  debug: (msg, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('debug', msg, meta));
    }
  }
};
