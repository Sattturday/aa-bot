import { z } from 'zod';

/** Элемент расписания: дни недели и время. */
const scheduleItemSchema = z.object({
  days: z.array(z.enum(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'])).min(1, 'необходимо указать хотя бы один день, например "Пн"'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'время должно быть в формате ЧЧ:ММ'),
});

/** Схема для замены расписаний группы (PUT /groups/:id/schedules). */
export const schedulesReplaceSchema = z.object({
  schedules: z.array(scheduleItemSchema).min(1, 'необходимо указать хотя бы одно расписание'),
});

export type SchedulesReplaceInput = z.infer<typeof schedulesReplaceSchema>;
