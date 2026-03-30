import { Request, Response } from 'express';
import * as settingsRepo from '../db/settingsRepo';
import { invalidateSettings } from '../db/dataProvider';

export function listSettings(req: Request, res: Response): void {
  res.json(settingsRepo.getAllSettings());
}

export function updateSetting(req: Request, res: Response): void {
  const { key } = req.params as Record<string, string>;
  const { value, description } = req.body;
  settingsRepo.upsertSetting(key, value, description);
  invalidateSettings();
  res.json({ ok: true });
}
