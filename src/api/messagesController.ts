import { Request, Response } from 'express';
import * as messagesRepo from '../db/messagesRepo';
import { invalidateMessages } from '../db/dataProvider';

export function listMessages(req: Request, res: Response): void {
  res.json(messagesRepo.getAllMessages());
}

export function updateMessage(req: Request, res: Response): void {
  const { key } = req.params as Record<string, string>;
  const { value, description } = req.body;
  messagesRepo.upsertMessage(key, value, description);
  invalidateMessages();
  res.json({ ok: true });
}
