import { z } from 'zod';

/** Схема для обновления настройки (PUT /settings/:key). */
export const settingUpdateSchema = z.object({
  value: z.string().min(1, 'value не может быть пустым'),
  description: z.string().optional(),
});

export type SettingUpdateInput = z.infer<typeof settingUpdateSchema>;
