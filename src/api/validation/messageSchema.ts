import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';

/** Схема для обновления текстового сообщения (PUT /messages/:key). */
export const messageUpdateSchema = z.object({
  value: z.string().min(1, messageCatalog.validation_value_required),
  description: z.string().optional(),
});

export type MessageUpdateInput = z.infer<typeof messageUpdateSchema>;
