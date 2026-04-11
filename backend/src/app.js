import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        const isAllowedVercelPreview = origin && /^https:\/\/.*\.vercel\.app$/i.test(origin);

        if (!origin || env.frontendOrigins.includes(origin) || isAllowedVercelPreview) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    })
  );

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.json({
      name: 'MindMitra API',
      status: 'running',
    });
  });

  app.use('/api', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
