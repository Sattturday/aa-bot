import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { Context } from 'telegraf';
import { createTranslator, MessageKey } from '../../../src/i18n';

type RegisteredHandler = (ctx: Context) => Promise<void>;

type MockBot = {
  start: (handler: RegisteredHandler) => void;
  action: (trigger: unknown, handler: RegisteredHandler) => void;
};

type MockContext = Context & {
  from?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  replyWithPhoto: (...args: unknown[]) => Promise<unknown>;
};

function createMockContext(): MockContext {
  return {
    from: {
      id: 1,
      first_name: 'Тест',
      last_name: 'Юзер',
      username: 'test_user',
    },
    replyWithPhoto: (async () => undefined as never) as MockContext['replyWithPhoto'],
  } as unknown as MockContext;
}

async function loadRegisterStartHandlers(): Promise<
  typeof import('../../../src/handlers/start').registerStartHandlers
> {
  const originalLoad = (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load;

  (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load = (request, parent, isMain) => {
    if (request === '../db/dataProvider') {
      return { getUrlValue: () => 'https://example.com/welcome.jpg' };
    }

    if (request === '../utils/history') {
      return { addToHistory: () => undefined };
    }

    if (request === '../utils/navigationStack') {
      return { pushToStack: () => undefined };
    }

    if (request === '../utils/utils') {
      return { sendWelcomeMessage: async () => undefined };
    }

    if (request === '../i18n') {
      return { t: (key: string) => `t:${key}` };
    }

    return originalLoad(request, parent, isMain);
  };

  try {
    const startModule = await import('../../../src/handlers/start');
    return startModule.registerStartHandlers;
  } finally {
    (Module as never as {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    })._load = originalLoad;
  }
}

test('registerStartHandlers uses i18n text resolver for start message', async () => {
  const registerStartHandlers = await loadRegisterStartHandlers();
  let startHandler: RegisteredHandler | null = null;
  const bot: MockBot = {
    start: handler => {
      startHandler = handler;
    },
    action: () => undefined,
  };

  registerStartHandlers(bot as never);
  if (!startHandler) {
    throw new Error('start handler is not registered');
  }

  const ctx = createMockContext();
  let capturedCaption = '';
  ctx.replyWithPhoto = (async (...args: unknown[]) => {
    const options = args[1] as { caption?: string } | undefined;
    capturedCaption = options?.caption ?? '';
    return undefined as never;
  }) as MockContext['replyWithPhoto'];

  await (startHandler as unknown as RegisteredHandler)(ctx);

  assert.equal(
    capturedCaption,
    't:start_greeting_prefixТестt:start_greeting_suffixt:start',
  );
});

test('integration-style missing key flow returns safe fallback and logs', () => {
  const logs: Array<{ label: string; payload: unknown }> = [];
  const translator = createTranslator({
    getRuntimeText: () => '',
    getRuntimeMap: () => ({}),
    logError: (label, payload) => {
      logs.push({ label, payload });
    },
  });

  const result = translator('missing.integration.key' as MessageKey);

  assert.equal(result, 'missing.integration.key');
  assert.equal(logs.length, 1);
  assert.equal(logs[0].label, '[i18n-missing-key]');
});
