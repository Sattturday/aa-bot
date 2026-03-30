import { z } from 'zod';

/** Схема для добавления администратора (POST /admins). */
export const adminCreateSchema = z.object({
  telegram_id: z.coerce.string().regex(/^\d+$/, 'telegram_id должен содержать только цифры'),
  name: z.string().optional(),
});

export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
