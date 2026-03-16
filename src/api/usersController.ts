import { Request, Response } from 'express';
import * as usersRepo from '../db/usersRepo';

export function listUsers(req: Request, res: Response): void {
  const limit = parseInt(req.query.limit as string, 10) || 100;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const users = usersRepo.getAllUsers(limit, offset);
  const total = usersRepo.getUserCount();
  res.json({ users, total });
}

export function getUserActions(req: Request, res: Response): void {
  const { telegram_id } = req.params as Record<string, string>;
  const limit = parseInt(req.query.limit as string, 10) || 100;
  const actions = usersRepo.getUserActions(telegram_id, limit);
  res.json(actions);
}

export function getStats(req: Request, res: Response): void {
  const hours = parseInt(req.query.hours as string, 10) || undefined;
  const stats = usersRepo.getStats(hours);
  res.json(stats);
}
