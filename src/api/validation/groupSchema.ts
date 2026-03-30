import { z } from 'zod';

/** Схема для создания группы (POST /groups). Расписание устанавливается отдельным эндпоинтом. */
export const groupCreateSchema = z.object({
  key: z.string().regex(/^[a-z0-9_-]+$/, 'key: строчные буквы, цифры, _ и -').optional(),
  type: z.enum(['aa', 'alanon']),
  name: z.string().min(1, 'name не может быть пустым'),
  address: z.string().min(1, 'address не может быть пустым'),
  city: z.string().min(1, 'city не может быть пустым'),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'телефон в формате +7 (XXX) XXX-XX-XX').optional(),
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
