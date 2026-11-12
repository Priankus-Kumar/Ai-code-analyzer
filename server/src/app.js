import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
import { env } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/AppError.js';
import routes from './routes/index.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
  })
);

// 3. Request ID middleware
app.use(requestId);

// 4. Morgan HTTP Request Logger (sanitized - logs method, URL, status, latency, request ID)
// if (env.NODE_ENV !== 'test') {
//   morgan.token('req-id', (req) => req.id || '-');
//   app.use(
//     morgan('[:date[iso]] [HTTP] :method :url :status :response-time ms - req-id: :req-id')
//   );
// }

// 5. Body Parsers with safe payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 6. Global API Rate Limiting
app.use('/api', apiLimiter);

// 7. Mount API Routes under /api/v1
app.use('/api/v1', routes);

// 8. 404 Route Catch-all
app.all('*', (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;
