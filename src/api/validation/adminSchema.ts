import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';

/** Схема для добавления администратора (POST /admins). */
export const adminCreateSchema = z.object({
  telegram_id: z.coerce.string().regex(/^\d+$/, messageCatalog.validation_admin_telegram_id_digits),
  name: z.string().optional(),
});

export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
