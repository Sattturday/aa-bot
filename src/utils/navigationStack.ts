/** Максимальное количество пользователей в навигационном стеке одновременно */
const MAX_NAV_USERS = 10000;

/** Словарь: userId → список посещённых экранов (порядок LIFO) */
let userNavigationStack: { [userId: string]: string[] } = {};

/**
 * Удаляет первую половину записей, когда количество пользователей превышает MAX_NAV_USERS.
 * Вызывается внутри pushToStack после каждого добавления.
 */
function trimNavigationStack(): void {
  const keys = Object.keys(userNavigationStack);
  if (keys.length > MAX_NAV_USERS) {
    // Удаляем первую половину (самые старые)
    const toRemove = keys.slice(0, keys.length - MAX_NAV_USERS);
    for (const k of toRemove) {
      delete userNavigationStack[k];
    }
  }
}

/**
 * Добавляет состояние в стек пользователя.
 * Создаёт запись для пользователя, если она не существует.
 * @param userId - идентификатор пользователя Telegram
 * @param state - ключ экрана, который нужно запомнить
 */
export function pushToStack(userId: string, state: string): void {
  if (!userNavigationStack[userId]) {
    userNavigationStack[userId] = [];
  }
  userNavigationStack[userId].push(state);
  trimNavigationStack();
}

/**
 * Извлекает последнее состояние из стека пользователя (LIFO).
 * @param userId - идентификатор пользователя Telegram
 * @returns ключ предыдущего экрана или null, если стек пуст
 */
export function popFromStack(userId: string): string | null {
  if (userNavigationStack[userId] && userNavigationStack[userId].length > 0) {
    return userNavigationStack[userId].pop() ?? null;
  }
  return null;
}

/**
 * Удаляет всю запись навигации пользователя из стека.
 * @param userId - идентификатор пользователя Telegram
 */
export function clearUserNavigationStack(userId: string): void {
  delete userNavigationStack[userId];
}
