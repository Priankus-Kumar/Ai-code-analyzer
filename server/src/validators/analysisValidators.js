import { z } from 'zod';
import {
  SUPPORTED_LANGUAGES,
  ANALYSIS_FOCUS_AREAS,
  FINDING_STATUSES,
  ANALYSIS_STATUSES,
  SEVERITY_LEVELS,
  DEFAULT_LIMITS
} from '../config/constants.js';

const LANGUAGE_ALIASES = {
  'c++': 'cpp',
  'c#': 'csharp',
  'golang': 'go',
  'bash': 'shell',
  'sh': 'shell',
  'zsh': 'shell',
  'js': 'javascript',
  'node': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby'
};

const normalizeLanguage = (val) => {
  if (typeof val !== 'string') return val;
  const cleaned = val.trim().toLowerCase();
  return LANGUAGE_ALIASES[cleaned] || cleaned;
};

export const createAnalysisSchema = z.object({
  title: z
    .string()
    .trim()
    .max(DEFAULT_LIMITS.MAX_TITLE_LENGTH, `Title cannot exceed ${DEFAULT_LIMITS.MAX_TITLE_LENGTH} characters`)
    .optional()
    .default('Untitled Analysis'),
  language: z
    .string({ required_error: 'Language is required' })
    .transform(normalizeLanguage)
    .pipe(
      z.enum(SUPPORTED_LANGUAGES, {
        errorMap: () => ({
          message: `Invalid language. Must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`
        })
      })
    ),
  sourceCode: z
    .string({ required_error: 'Source code is required' })
    .min(DEFAULT_LIMITS.MIN_CODE_LENGTH, 'Source code is too short to analyze')
    .max(DEFAULT_LIMITS.MAX_CODE_LENGTH, `Source code exceeds maximum limit of ${DEFAULT_LIMITS.MAX_CODE_LENGTH} characters`),
  focus: z
    .enum(ANALYSIS_FOCUS_AREAS, {
      errorMap: () => ({
        message: `Invalid focus area. Must be one of: ${ANALYSIS_FOCUS_AREAS.join(', ')}`
      })
    })
    .optional()
    .default('general')
});

export const getAnalysesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(DEFAULT_LIMITS.MAX_PAGE_SIZE).default(DEFAULT_LIMITS.DEFAULT_PAGE_SIZE),
  language: z
    .string()
    .transform(normalizeLanguage)
    .pipe(z.enum(SUPPORTED_LANGUAGES))
    .optional(),
  status: z.enum(ANALYSIS_STATUSES).optional(),
  severity: z.enum(SEVERITY_LEVELS).optional(),
  startDate: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  endDate: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  search: z.string().trim().optional()
});

export const updateFindingStatusSchema = z.object({
  status: z.enum(FINDING_STATUSES, {
    errorMap: () => ({
      message: `Invalid status. Must be one of: ${FINDING_STATUSES.join(', ')}`
    })
  })
});
