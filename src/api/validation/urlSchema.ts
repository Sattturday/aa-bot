import { z } from 'zod';

/** Схема для обновления URL-записи (PUT /urls/:key). */
export const urlUpdateSchema = z.object({
  value: z.string().url('value должен быть валидным URL'),
  description: z.string().optional(),
});

export type UrlUpdateInput = z.infer<typeof urlUpdateSchema>;
