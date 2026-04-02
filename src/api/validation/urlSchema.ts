import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';

/** Схема для обновления URL-записи (PUT /urls/:key). */
export const urlUpdateSchema = z.object({
  value: z.string().url(messageCatalog.validation_url_format),
  description: z.string().optional(),
});

export type UrlUpdateInput = z.infer<typeof urlUpdateSchema>;
