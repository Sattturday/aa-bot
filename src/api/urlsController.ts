import { Request, Response } from 'express';
import * as urlsRepo from '../db/urlsRepo';
import { invalidateUrls } from '../db/dataProvider';

export function listUrls(req: Request, res: Response): void {
  res.json(urlsRepo.getAllUrls());
}

export function updateUrl(req: Request, res: Response): void {
  const { key } = req.params as Record<string, string>;
  const { value, description } = req.body;

  if (!value) {
    res.status(400).json({ error: 'value is required' });
    return;
  }

  urlsRepo.upsertUrl(key, value, description);
  invalidateUrls();
  res.json({ ok: true });
}
