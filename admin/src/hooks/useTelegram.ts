declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          setText: (text: string) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        themeParams: Record<string, string>;
        colorScheme: 'light' | 'dark';
        headerColor: string;
        backgroundColor: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export type TelegramWebApp = NonNullable<Window['Telegram']>['WebApp'];
export type TelegramUser = NonNullable<
  TelegramWebApp['initDataUnsafe']['user']
>;

interface UseTelegramResult {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  initData: string | null;
}

export function useTelegram(): UseTelegramResult {
  const webApp = window.Telegram?.WebApp ?? null;
  const user = webApp?.initDataUnsafe?.user ?? null;
  const initData = webApp?.initData || null;

  return { webApp, user, initData };
}
