import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the server's single environment file.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  MONGODB_URI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/ai-code-analyzer',
    
  JWT_SECRET:
    process.env.JWT_SECRET ||
    process.env.ACCESS_TOKEN ||
    'dev_jwt_secret_key_antigravity_code_analyzer_32chars',
    
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  
  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY ||
    process.env.AI_GEMINI_TOKEN_KEY ||
    '',
    
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  
  MAX_CODE_LENGTH: parseInt(process.env.MAX_CODE_LENGTH, 10) || 25000,
  MAX_FINDINGS: parseInt(process.env.MAX_FINDINGS, 10) || 30,
  AI_TIMEOUT_MS: parseInt(process.env.AI_TIMEOUT_MS, 10) || 30000,
  
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  ANALYSIS_RATE_LIMIT_MAX: parseInt(process.env.ANALYSIS_RATE_LIMIT_MAX, 10) || 20
};
