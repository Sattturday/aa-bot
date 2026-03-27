import { Request, Response } from 'express';
import * as adminsRepo from '../db/adminsRepo';

export function listAdmins(req: Request, res: Response): void {
  res.json(adminsRepo.getAllAdmins());
}

export function addAdmin(req: Request, res: Response): void {
  const { telegram_id, name } = req.body;
  if (!telegram_id) {
    res.status(400).json({ error: 'telegram_id is required' });
    return;
  }
  adminsRepo.addAdmin(telegram_id, name);
  res.status(201).json({ ok: true });
}

export function removeAdmin(req: Request, res: Response): void {
  const { telegram_id } = req.params as Record<string, string>;
  const allAdmins = adminsRepo.getAllAdmins();
  if (allAdmins.length <= 1) {
    res.status(400).json({ error: 'Cannot remove the last admin' });
    return;
  }
  const callerId = (req as any).telegramId;
  if (callerId === telegram_id) {
    res.status(400).json({ error: 'Cannot remove yourself' });
    return;
  }
  const removed = adminsRepo.removeAdmin(telegram_id);
  if (!removed) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }
  res.json({ ok: true });
}
