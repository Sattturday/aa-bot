import { Request, Response } from 'express';
import * as groupsRepo from '../db/groupsRepo';
import { invalidateGroups } from '../db/dataProvider';
import { slugify } from '../utils/slugify';

export function listGroups(req: Request, res: Response): void {
  const type = req.query.type as 'aa' | 'alanon' | undefined;
  const groups = type ? groupsRepo.getGroupsByType(type) : groupsRepo.getAllGroups();
  res.json(groups);
}

export function getGroup(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string, 10);
  const group = groupsRepo.getGroupById(id);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json(group);
}

export function createGroup(req: Request, res: Response): void {
  try {
    const data = { ...req.body };

    if (!data.key) {
      data.key = generateUniqueKey(data.name, data.type);
    }

    const group = groupsRepo.createGroup(data);
    invalidateGroups();
    res.status(201).json(group);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

function generateUniqueKey(name: string, type: string): string {
  const base = `${type}-${slugify(name)}`;
  let key = base;
  let counter = 2;
  while (groupsRepo.getGroupByKey(key)) {
    key = `${base}-${counter}`;
    counter++;
  }
  return key;
}

export function updateGroup(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string, 10);
  const group = groupsRepo.updateGroup(id, req.body);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  invalidateGroups();
  res.json(group);
}

export function deleteGroup(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string, 10);
  const deleted = groupsRepo.deleteGroup(id);
  if (!deleted) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  invalidateGroups();
  res.json({ ok: true });
}

export function replaceSchedules(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string, 10);
  const group = groupsRepo.getGroupById(id);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  groupsRepo.replaceSchedules(id, req.body.schedules || []);
  invalidateGroups();
  res.json(groupsRepo.getGroupById(id));
}
