import { messageCatalog } from './messages';
import { MessageKey } from './types';

type TranslatorDeps = {
  getRuntimeText: (key: string) => string;
  getRuntimeMap: () => Record<string, string>;
  logError: (label: string, payload: unknown) => void;
};

const defaultDeps: TranslatorDeps = {
  getRuntimeText: key => {
    const dataProvider = loadDataProvider();
    return dataProvider.getMessageText(key);
  },
  getRuntimeMap: () => {
    const dataProvider = loadDataProvider();
    return dataProvider.getAllMessageValues();
  },
  logError: (label, payload) => {
    console.error(label, payload);
  },
};

type DataProviderModule = {
  getMessageText: (key: string) => string;
  getAllMessageValues: () => Record<string, string>;
};

let cachedDataProvider: DataProviderModule | null = null;

function loadDataProvider(): DataProviderModule {
  if (cachedDataProvider) {
    return cachedDataProvider;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  cachedDataProvider = require('../db/dataProvider') as DataProviderModule;
  return cachedDataProvider;
}

export function createTranslator(deps: TranslatorDeps = defaultDeps): (key: MessageKey) => string {
  return (key: MessageKey): string => {
    const runtimeValue = deps.getRuntimeText(key);
    if (runtimeValue.trim() !== '') {
      return runtimeValue;
    }

    const hasCatalogKey = Object.prototype.hasOwnProperty.call(messageCatalog, key);
    if (hasCatalogKey) {
      const catalogValue = messageCatalog[key as keyof typeof messageCatalog];
      if (catalogValue.trim() !== '') {
        return catalogValue;
      }
    }

    const runtimeMap = deps.getRuntimeMap();
    const hasRuntimeKey = Object.prototype.hasOwnProperty.call(runtimeMap, key);
    const reason = hasRuntimeKey ? 'empty' : 'missing';

    deps.logError('[i18n-missing-key]', {
      key,
      reason,
      resolvedFrom: 'none',
    });

    return key;
  };
}

export const t = createTranslator();

export type { MessageKey } from './types';
export { isMessageKey, mapButtonKeyToMessageKey } from './keyMapping';
