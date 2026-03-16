import express from 'express';
import * as path from 'path';
import { Telegraf } from 'telegraf';
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import apiRouter from './api/router';

export function createServer(bot: Telegraf<Context<Update>>): express.Application {
  const app = express();

  app.use(express.json());

  // API routes
  app.use('/api', apiRouter);

  // Serve admin Mini App static files (will be built to admin/dist/)
  const adminDistPath = path.resolve(__dirname, '../admin/dist');
  app.use(express.static(adminDistPath));

  // SPA fallback for admin panel
  app.get('/{*path}', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.sendFile(path.join(adminDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Admin panel not built yet. Run build in admin/ directory.');
      }
    });
  });

  return app;
}
