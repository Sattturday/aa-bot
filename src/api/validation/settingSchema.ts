import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';

/** Схема для обновления настройки (PUT /settings/:key). */
export const settingUpdateSchema = z.object({
  value: z.string().min(1, messageCatalog.validation_value_required),
  description: z.string().optional(),
});

export type SettingUpdateInput = z.infer<typeof settingUpdateSchema>;
