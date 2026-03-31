import test from 'node:test';
import assert from 'node:assert/strict';
import { Context } from 'telegraf';
import {
  DEFAULT_HANDLER_ERROR_MESSAGE,
  withErrorHandler,
} from '../../../../src/utils/handlers/withErrorHandler';

type MockContext = Context & {
  from?: {
    id?: number;
  };
  reply: (message: string) => Promise<unknown>;
};

function createMockContext(): MockContext {
  return {
    from: { id: 12345 },
    reply: (async () => undefined as never) as MockContext['reply'],
  } as unknown as MockContext;
}

test('withErrorHandler does not log or send fallback on success', async () => {
  const ctx = createMockContext();
  let replyCalls = 0;
  let handlerCalls = 0;
  const errors: unknown[][] = [];

  ctx.reply = (async () => {
    replyCalls += 1;
    return undefined as never;
  }) as MockContext['reply'];

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    const wrapped = withErrorHandler({
      label: 'test:success',
      handler: async () => {
        handlerCalls += 1;
      },
    });

    await wrapped(ctx);
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(handlerCalls, 1);
  assert.equal(replyCalls, 0);
  assert.equal(errors.length, 0);
});

test('withErrorHandler logs handler error and sends default fallback', async () => {
  const ctx = createMockContext();
  const replies: string[] = [];
  const errors: unknown[][] = [];

  ctx.reply = (async (message: string) => {
    replies.push(message);
    return undefined as never;
  }) as MockContext['reply'];

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    const wrapped = withErrorHandler({
      label: 'test:failure',
      handler: async () => {
        throw new Error('boom');
      },
    });

    await wrapped(ctx);
  } finally {
    console.error = originalConsoleError;
  }

  assert.deepEqual(replies, [DEFAULT_HANDLER_ERROR_MESSAGE]);
  assert.equal(errors.length, 1);
  assert.equal(errors[0][0], '[handler-error]');
  assert.deepEqual(errors[0][1], {
    label: 'test:failure',
    userId: '12345',
    stage: 'handler',
    error: new Error('boom'),
  });
});

test('withErrorHandler swallows fallback reply errors and logs fallback stage', async () => {
  const ctx = createMockContext();
  const errors: unknown[][] = [];
  const fallbackError = new Error('reply failed');

  ctx.reply = (async () => {
    throw fallbackError;
  }) as MockContext['reply'];

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    const wrapped = withErrorHandler({
      label: 'test:fallback',
      handler: async () => {
        throw new Error('handler failed');
      },
    });

    await wrapped(ctx);
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(errors.length, 2);
  assert.equal(errors[0][0], '[handler-error]');
  assert.equal(errors[1][0], '[handler-error]');
  assert.deepEqual(errors[1][1], {
    label: 'test:fallback',
    userId: '12345',
    stage: 'fallback',
    error: fallbackError,
  });
});
