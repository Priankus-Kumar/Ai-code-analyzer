import mongoose from 'mongoose';
import {
  SUPPORTED_LANGUAGES,
  ANALYSIS_FOCUS_AREAS,
  ANALYSIS_STATUSES,
  FINDING_CATEGORIES,
  SEVERITY_LEVELS,
  FINDING_STATUSES,
  DEFAULT_LIMITS
} from '../config/constants.js';

const findingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Finding title is required'],
      trim: true,
      maxlength: 200
    },
    category: {
      type: String,
      enum: FINDING_CATEGORIES,
      default: 'other'
    },
    severity: {
      type: String,
      enum: SEVERITY_LEVELS,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    lineStart: {
      type: Number,
      required: true,
      min: 1
    },
    lineEnd: {
      type: Number,
      required: true,
      validate: {
        validator: function (val) {
          return val >= this.lineStart;
        },
        message: 'lineEnd must be greater than or equal to lineStart'
      }
    },
    evidence: {
      type: String,
      default: ''
    },
    recommendation: {
      type: String,
      default: ''
    },
    suggestedCode: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      enum: ['ai', 'static-analysis'],
      default: 'ai'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    },
    status: {
      type: String,
      enum: FINDING_STATUSES,
      default: 'open'
    }
  },
  { _id: true, timestamps: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
      index: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: [DEFAULT_LIMITS.MAX_TITLE_LENGTH, 'Title cannot exceed 120 characters'],
      default: 'Untitled Analysis'
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      lowercase: true,
      enum: {
        values: SUPPORTED_LANGUAGES,
        message: '{VALUE} is not a supported programming language'
      }
    },
    sourceCode: {
      type: String,
      required: [true, 'Source code is required'],
      maxlength: [DEFAULT_LIMITS.MAX_CODE_LENGTH, 'Source code exceeds maximum length limit']
    },
    focus: {
      type: String,
      enum: ANALYSIS_FOCUS_AREAS,
      default: 'general'
    },
    status: {
      type: String,
      enum: ANALYSIS_STATUSES,
      default: 'pending'
    },
    summary: {
      type: String,
      default: ''
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    findings: {
      type: [findingSchema],
      default: []
    },
    provider: {
      type: String,
      default: 'gemini'
    },
    model: {
      type: String,
      default: ''
    },
    durationMs: {
      type: Number,
      default: 0
    },
    errorCode: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound indexes requested in readme:
// analyses {userId:1, createdAt:-1}, {userId:1, status:1, createdAt:-1}, {userId:1, language:1, createdAt:-1}
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ userId: 1, status: 1, createdAt: -1 });
analysisSchema.index({ userId: 1, language: 1, createdAt: -1 });

export const Analysis = mongoose.model('Analysis', analysisSchema);
