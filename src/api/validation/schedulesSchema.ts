import { z } from 'zod';
import { messageCatalog } from '../../i18n/messages';
import { weekDaysRu } from '../../i18n/weekdays';

/** Элемент расписания: дни недели и время. */
const scheduleItemSchema = z.object({
  days: z.array(z.enum(weekDaysRu)).min(1, messageCatalog.validation_schedule_day_required),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, messageCatalog.validation_schedule_time_format),
});

/** Схема для замены расписаний группы (PUT /groups/:id/schedules). */
export const schedulesReplaceSchema = z.object({
  schedules: z.array(scheduleItemSchema).min(1, messageCatalog.validation_schedule_required),
});

export type SchedulesReplaceInput = z.infer<typeof schedulesReplaceSchema>;
