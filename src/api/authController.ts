import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validateInitData } from '../utils/telegramAuth';
import { isAdmin } from '../db/adminsRepo';
import { getJwtSecret } from './authMiddleware';

export function validateAuth(req: Request, res: Response): void {
  const { initData } = req.body;
  const botToken = process.env.BOT_TOKEN;

  if (!initData || !botToken) {
    res.status(400).json({ error: 'Missing initData' });
    return;
  }

  const result = validateInitData(initData, botToken);

  if (!result.valid || !result.userId) {
    res.status(401).json({ error: 'Invalid initData' });
    return;
  }

  if (!isAdmin(result.userId)) {
    res.status(403).json({ error: 'Not an admin' });
    return;
  }

  const token = jwt.sign(
    { telegramId: result.userId },
    getJwtSecret(),
    { expiresIn: '1h' },
  );

  res.json({ token, telegramId: result.userId });
}
