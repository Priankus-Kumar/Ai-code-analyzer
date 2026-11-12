import {
  createAndRunAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysisById,
  updateFindingStatus
} from '../services/analysisService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const { title, language, sourceCode, focus } = req.body;
  const userId = req.user._id;

  const analysis = await createAndRunAnalysis({
    userId,
    title,
    language,
    sourceCode,
    focus
  });

  res.status(201).json({
    data: {
      analysis
    }
  });
});

export const list = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit, language, status, severity, startDate, endDate, search } = req.query;

  const result = await getAnalyses({
    userId,
    page,
    limit,
    language,
    status,
    severity,
    startDate,
    endDate,
    search
  });

  res.status(200).json({
    data: result
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const analysis = await getAnalysisById({ id, userId });

  res.status(200).json({
    data: {
      analysis
    }
  });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  await deleteAnalysisById({ id, userId });

  res.status(200).json({
    data: {
      message: 'Analysis deleted successfully'
    }
  });
});

export const updateFinding = asyncHandler(async (req, res) => {
  const { id, findingId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const analysis = await updateFindingStatus({
    id,
    findingId,
    userId,
    status
  });

  res.status(200).json({
    data: {
      analysis
    }
  });
});
