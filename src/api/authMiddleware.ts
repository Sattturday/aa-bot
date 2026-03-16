import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'default-secret-change-me';
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret()) as { telegramId: string };
    (req as any).telegramId = payload.telegramId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
