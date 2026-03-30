import { z } from 'zod';

/** Схема для обновления текстового сообщения (PUT /messages/:key). */
export const messageUpdateSchema = z.object({
  value: z.string().min(1, 'value не может быть пустым'),
  description: z.string().optional(),
});

export type MessageUpdateInput = z.infer<typeof messageUpdateSchema>;
