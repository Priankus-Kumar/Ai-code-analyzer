import mongoose from 'mongoose';
import { env } from '../config/env.js';

export const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    data: {
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'ai-agile-code-analyzer',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      database: dbStatusMap[dbState] || 'unknown',
      modelConfigured: !!env.GEMINI_API_KEY
    }
  });
};
