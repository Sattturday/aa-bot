import { RequestHandler } from 'express';
import { ZodType } from 'zod';

/**
 * Фабрика middleware для валидации тела запроса через Zod-схему.
 *
 * Args:
 *   schema: Zod-схема, которой должно соответствовать тело запроса.
 *
 * Returns:
 *   Express middleware: при успешной валидации заменяет req.body очищенными
 *   данными и передаёт управление следующему обработчику; при ошибке —
 *   возвращает 400 Bad Request со структурированным описанием нарушений.
 */
/** Превращает пустые строки в undefined, чтобы optional-поля не падали при валидации. */
function stripEmptyStrings(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...obj };
  for (const key of Object.keys(out)) {
    if (out[key] === '') out[key] = undefined;
  }
  return out;
}

export function validateBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(stripEmptyStrings(req.body));
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
