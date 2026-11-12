import { Analysis } from '../models/Analysis.js';
import { analyzeCodeWithGemini } from './geminiService.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Converts findings into Agile tasks grouped by category
 */
export const generateAgileTasks = (findings = []) => {
  const priorityMap = {
    critical: 'P0 - Immediate Fix',
    high: 'P1 - High Priority',
    medium: 'P2 - Standard Sprint',
    low: 'P3 - Low / Nice to have',
    info: 'P4 - Documentation / Info'
  };

  const groupMap = {
    bug: 'Bug Fixes',
    security: 'Security Vulnerabilities',
    performance: 'Performance Optimizations',
    readability: 'Code Cleanliness & Refactoring',
    maintainability: 'Maintainability & Architecture',
    testing: 'Test Suite Coverage',
    other: 'General Improvements'
  };

  const tasks = findings.map((f, index) => {
    return {
      taskId: `TASK-${index + 1}`,
      findingId: f._id,
      title: `[${f.severity.toUpperCase()}] ${f.title}`,
      group: groupMap[f.category] || 'General Improvements',
      category: f.category,
      severity: f.severity,
      priority: priorityMap[f.severity] || 'P2 - Standard Sprint',
      description: f.description,
      lines: `Lines ${f.lineStart} - ${f.lineEnd}`,
      acceptanceNotes: [
        f.recommendation || 'Verify issue has been resolved according to architectural standards.',
        `Ensure code around lines ${f.lineStart}-${f.lineEnd} passes unit tests.`,
        'Check that no regressions were introduced.'
      ],
      suggestedCode: f.suggestedCode || ''
    };
  });

  // Group tasks by group name
  const grouped = {};
  for (const task of tasks) {
    if (!grouped[task.group]) {
      grouped[task.group] = [];
    }
    grouped[task.group].push(task);
  }

  return {
    totalTasks: tasks.length,
    groups: grouped,
    taskList: tasks
  };
};

export const createAndRunAnalysis = async ({ userId, title, language, sourceCode, focus }) => {
  const startTime = Date.now();

  // 1. Create initial analysis document in 'processing' status
  const analysis = await Analysis.create({
    userId,
    title: title || 'Untitled Analysis',
    language,
    sourceCode,
    focus: focus || 'general',
    status: 'processing',
    provider: 'gemini'
  });

  try {
    // 2. Call Gemini
    const result = await analyzeCodeWithGemini({
      language,
      focus: analysis.focus,
      sourceCode
    });

    const durationMs = Date.now() - startTime;

    // 3. Mark completed and store validated result
    analysis.status = 'completed';
    analysis.summary = result.summary;
    analysis.qualityScore = result.qualityScore;
    analysis.findings = result.findings;
    analysis.model = result.model;
    analysis.durationMs = durationMs;
    analysis.errorCode = null;

    await analysis.save();

    logger.info(`Analysis completed: ${analysis._id} in ${durationMs}ms`);
    return analysis;
  } catch (error) {
    const durationMs = Date.now() - startTime;

    // 4. On failure, mark failed with safe error code
    const safeErrorCode = error.code || 'AI_PROCESSING_FAILED';
    analysis.status = 'failed';
    analysis.errorCode = safeErrorCode;
    analysis.durationMs = durationMs;

    try {
      await analysis.save();
    } catch (saveErr) {
      logger.error('Failed to save error status on analysis:', saveErr.message);
    }

    logger.error(`Analysis failed: ${analysis._id} - ${error.message}`, {
      code: safeErrorCode,
      durationMs
    });

    // Bubble up error so controller responds with standard error envelope
    throw error;
  }
};

export const getAnalyses = async ({
  userId,
  page = 1,
  limit = 10,
  language,
  status,
  severity,
  startDate,
  endDate,
  search
}) => {
  // Enforce user ownership strictly
  const filter = { userId };

  if (language) filter.language = language;
  if (status) filter.status = status;
  if (severity) filter['findings.severity'] = severity;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      // If date string only, include full day
      if (typeof endDate === 'string' && endDate.length === 10) {
        end.setHours(23, 59, 59, 999);
      }
      filter.createdAt.$lte = end;
    }
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find(filter)
      .select('-sourceCode') // Exclude raw code from list view for performance
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Analysis.countDocuments(filter)
  ]);

  return {
    analyses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

export const getAnalysisById = async ({ id, userId }) => {
  // Query strictly includes userId - foreign analyses return 404
  const analysis = await Analysis.findOne({ _id: id, userId });
  if (!analysis) {
    throw AppError.notFound('Analysis report not found.');
  }

  const analysisObj = analysis.toObject();
  analysisObj.agileTasks = generateAgileTasks(analysisObj.findings);

  return analysisObj;
};

export const deleteAnalysisById = async ({ id, userId }) => {
  // Query strictly includes userId - foreign analyses return 404
  const deleted = await Analysis.findOneAndDelete({ _id: id, userId });
  if (!deleted) {
    throw AppError.notFound('Analysis report not found.');
  }
  return deleted;
};

export const updateFindingStatus = async ({ id, findingId, userId, status }) => {
  const analysis = await Analysis.findOne({ _id: id, userId });
  if (!analysis) {
    throw AppError.notFound('Analysis report not found.');
  }

  const finding = analysis.findings.id(findingId);
  if (!finding) {
    throw AppError.notFound('Finding not found in this analysis.');
  }

  finding.status = status;
  await analysis.save();

  return analysis;
};
