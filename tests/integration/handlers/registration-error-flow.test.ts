import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { Context } from 'telegraf';
import { buttonKeys } from '../../../src/data/buttonKeys';
import { MessageKey } from '../../../src/i18n';
import {
  DEFAULT_HANDLER_ERROR_MESSAGE,
  withErrorHandler,
} from '../../../src/utils/handlers/withErrorHandler';

type RegisteredHandler = (ctx: Context) => Promise<void>;

type MockBot = {
  action: (trigger: unknown, handler: RegisteredHandler) => void;
};

type MockContext = Context & {
  from?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  reply: (message: string) => Promise<unknown>;
  answerCbQuery: () => Promise<unknown>;
};

function createMockContext(): MockContext {
  return {
    from: {
      id: 77,
      first_name: 'Test',
      last_name: 'User',
      username: 'tester',
    },
    reply: (async () => undefined as never) as MockContext['reply'],
    answerCbQuery: (async () => undefined as never) as MockContext['answerCbQuery'],
  } as unknown as MockContext;
}

async function loadRegisterCategory(): Promise<
  typeof import('../../../src/handlers/factory').registerCategory
> {
  const originalLoad = (Module as never as {
    _load: (
      request: string,
      parent: unknown,
      isMain: boolean,
    ) => unknown,
  })._load;

  (Module as never as {
    _load: (
      request: string,
      parent: unknown,
      isMain: boolean,
    ) => unknown,
  })._load = (request, parent, isMain) => {
    if (request === '../utils/history') {
      return { addToHistory: () => undefined };
    }

    if (request === '../utils/navigationStack') {
      return { pushToStack: () => undefined };
    }

    if (request === '../utils/utils') {
      return {
        handleButtonAction: async () => undefined,
        handleButtonActionWithImage: async () => undefined,
      };
    }

    return originalLoad(request, parent, isMain);
  };

  try {
    const factoryModule = await import('../../../src/handlers/factory');
    return factoryModule.registerCategory;
  } finally {
    (Module as never as {
      _load: (
        request: string,
        parent: unknown,
        isMain: boolean,
      ) => unknown,
    })._load = originalLoad;
  }
}

test('direct registration through withErrorHandler returns fallback on error and no fallback on success', async () => {
  const handlers = new Map<string, RegisteredHandler>();
  const bot: MockBot = {
    action: (trigger, handler) => {
      handlers.set(String(trigger), handler);
    },
  };

  bot.action('standalone_error', withErrorHandler({
    label: 'action:standalone_error',
    handler: async () => {
      throw new Error('standalone');
    },
  }));

  bot.action('standalone_success', withErrorHandler({
    label: 'action:standalone_success',
    handler: async () => undefined,
  }));

  const errorReplies: string[] = [];
  const successReplies: string[] = [];

  const errorCtx = createMockContext();
  errorCtx.reply = (async (message: string) => {
    errorReplies.push(message);
    return undefined as never;
  }) as MockContext['reply'];

  const successCtx = createMockContext();
  successCtx.reply = (async (message: string) => {
    successReplies.push(message);
    return undefined as never;
  }) as MockContext['reply'];

  await handlers.get('standalone_error')!(errorCtx);
  await handlers.get('standalone_success')!(successCtx);

  assert.deepEqual(errorReplies, [DEFAULT_HANDLER_ERROR_MESSAGE]);
  assert.deepEqual(successReplies, []);
});

test('registerCategory uses wrapper label and fallback when factory action fails', async () => {
  const registerCategory = await loadRegisterCategory();
  const handlers = new Map<string, RegisteredHandler>();
  const triggers: string[] = [];
  const errors: unknown[][] = [];
  const bot = {
    action: (trigger: unknown, handler: RegisteredHandler) => {
      triggers.push(String(trigger));
      handlers.set(String(trigger), handler);
    },
  };

  registerCategory({
    bot: bot as never,
    category: 'welcome',
    keys: buttonKeys.start,
    keyMapper: key => ({ actionKey: key as MessageKey }),
  });

  const ctx = createMockContext();
  const replies: string[] = [];

  ctx.answerCbQuery = (async () => {
    throw new Error('answer failed');
  }) as MockContext['answerCbQuery'];
  ctx.reply = (async (message: string) => {
    replies.push(message);
    return undefined as never;
  }) as MockContext['reply'];

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    await handlers.get('welcome')!(ctx);
  } finally {
    console.error = originalConsoleError;
  }

  assert.deepEqual(triggers, ['welcome']);
  assert.deepEqual(replies, [DEFAULT_HANDLER_ERROR_MESSAGE]);
  assert.equal(errors.length, 1);
  assert.equal(errors[0][0], '[handler-error]');
  assert.deepEqual(errors[0][1], {
    label: 'action:welcome',
    userId: '77',
    stage: 'handler',
    error: new Error('answer failed'),
  });
});
