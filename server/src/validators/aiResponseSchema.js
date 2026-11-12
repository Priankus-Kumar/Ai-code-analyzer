import { z } from 'zod';
import { FINDING_CATEGORIES, SEVERITY_LEVELS } from '../config/constants.js';

export const aiFindingSchema = z.object({
  title: z
    .string()
    .catch('Code Observation')
    .transform((s) => s.slice(0, 200)),
  category: z
    .enum(FINDING_CATEGORIES)
    .catch('other'),
  severity: z
    .enum(SEVERITY_LEVELS)
    .catch('medium'),
  description: z.string().catch('No detailed description provided.'),
  lineStart: z.coerce.number().int().min(1).catch(1),
  lineEnd: z.coerce.number().int().min(1).catch(1),
  evidence: z.string().optional().default(''),
  recommendation: z.string().optional().default(''),
  suggestedCode: z.string().optional().default(''),
  source: z.string().catch('ai'),
  confidence: z.coerce.number().min(0).max(1).nullable().catch(0.85).default(0.85)
});

export const aiResponseSchema = z.object({
  summary: z
    .string()
    .catch('Code analysis completed successfully.')
    .default('Code analysis completed successfully.'),
  qualityScore: z.coerce.number().min(0).max(100).nullable().catch(null).default(null),
  findings: z.array(aiFindingSchema).default([])
});
