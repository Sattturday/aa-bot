import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';

/** Схема для создания группы (POST /groups). Расписание устанавливается отдельным эндпоинтом. */
export const groupCreateSchema = z.object({
  key: z.string().regex(/^[a-z0-9_-]+$/, messageCatalog.validation_group_key_format).optional(),
  type: z.enum(['aa', 'alanon']),
  name: z.string().min(1, messageCatalog.validation_group_name_required),
  address: z.string().min(1, messageCatalog.validation_group_address_required),
  city: z.string().min(1, messageCatalog.validation_group_city_required),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, messageCatalog.validation_group_phone_format).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  image_url: z.string().url().optional(),
  map_link: z.string().url().optional(),
  video_path: z.string().url().optional(),
  sort_order: z.number().int().optional(),
});

/** Схема для обновления группы (PUT /groups/:id) — все поля опциональны. */
export const groupUpdateSchema = groupCreateSchema.partial();

export type GroupCreateInput = z.infer<typeof groupCreateSchema>;
export type GroupUpdateInput = z.infer<typeof groupUpdateSchema>;
