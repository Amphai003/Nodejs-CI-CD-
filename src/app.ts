import express, { Application } from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
}
