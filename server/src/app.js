import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

export const app = express();

// Security headers
app.use(helmet());

// CORS configuration matching CLIENT_ORIGIN
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching CLIENT_ORIGIN
      if (!origin || origin === env.CLIENT_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// Global rate limiting
app.use(globalLimiter);

// Request body size limit 20kb
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api', apiRoutes);

// Catch 404
app.use(notFound);

// Centralized error handler
app.use(errorHandler);
