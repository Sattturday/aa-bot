/** Максимальное количество пользователей в навигационном стеке одновременно */
const MAX_NAV_USERS = 10000;

export type NavigationStackApi = {
  pushToStack: (userId: string, state: string) => void;
  popFromStack: (userId: string) => string | null;
  clearUserNavigationStack: (userId: string) => void;
};

export function createNavigationStack(maxNavUsersLimit = MAX_NAV_USERS): NavigationStackApi {
  /** Словарь: userId → список посещённых экранов (порядок LIFO) */
  const userNavigationStack: Record<string, string[]> = {};

  function trimNavigationStack(): void {
    const keys = Object.keys(userNavigationStack);
    if (keys.length > maxNavUsersLimit) {
      const toRemove = keys.slice(0, keys.length - maxNavUsersLimit);
      for (const k of toRemove) {
        delete userNavigationStack[k];
      }
    }
  }

  return {
    pushToStack(userId: string, state: string): void {
      if (!userNavigationStack[userId]) {
        userNavigationStack[userId] = [];
      }
      userNavigationStack[userId].push(state);
      trimNavigationStack();
    },
    popFromStack(userId: string): string | null {
      if (userNavigationStack[userId] && userNavigationStack[userId].length > 0) {
        return userNavigationStack[userId].pop() ?? null;
      }
      return null;
    },
    clearUserNavigationStack(userId: string): void {
      delete userNavigationStack[userId];
    },
  };
}

const navigationStack = createNavigationStack();

export const { pushToStack, popFromStack, clearUserNavigationStack } = navigationStack;
