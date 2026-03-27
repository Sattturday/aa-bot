import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

/**
 * Результат маппинга ключа кнопки в параметры обработчика.
 *
 * Args:
 *   actionKey: Ключ экрана для вызова обработчика отображения.
 *   imageUrl: Если задан — используется обработчик с изображением.
 */
export interface KeyMapResult {
  actionKey: string;
  imageUrl?: string;
}

/**
 * Параметры для фабрики регистрации обработчиков категории.
 *
 * Args:
 *   bot: Экземпляр Telegraf-бота.
 *   category: Ключ состояния навигации, который добавляется в стек при нажатии кнопки.
 *   keys: Список action-ключей кнопок данной категории.
 *   keyMapper: Функция, преобразующая action-ключ в параметры отображения экрана.
 */
export interface RegisterCategoryOptions {
  bot: Telegraf<Context<Update>>;
  category: string;
  keys: string[];
  keyMapper: (key: string) => KeyMapResult;
}
