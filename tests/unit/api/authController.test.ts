import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';

type ValidateAuth = typeof import('../../../src/api/authController').validateAuth;

type MockRequest = {
  body: {
    initData?: string;
  };
};

type MockResponse = {
  statusCode?: number;
  payload?: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

function createResponse(): MockResponse {
  return {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  };
}

async function loadValidateAuth(options?: {
  validateInitDataResult?: { valid: boolean; userId?: string };
  isAdmin?: boolean;
  jwtSignResult?: string;
  jwtSecret?: string;
}): Promise<{
  validateAuth: ValidateAuth;
  signCalls: Array<{ payload: unknown; secret: string; options: unknown }>;
}> {
  const signCalls: Array<{ payload: unknown; secret: string; options: unknown }> = [];
  const originalLoad = (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load;
  const modulePath = require.resolve('../../../src/api/authController');
  delete require.cache[modulePath];

  (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load = (request, parent, isMain) => {
    if (request === '../utils/telegramAuth') {
      return {
        validateInitData: () => options?.validateInitDataResult ?? { valid: true, userId: '99' },
      };
    }

    if (request === '../db/adminsRepo') {
      return {
        isAdmin: () => options?.isAdmin ?? true,
      };
    }

    if (request === './authMiddleware') {
      return {
        getJwtSecret: () => options?.jwtSecret ?? 'jwt-secret',
      };
    }

    if (request === 'jsonwebtoken') {
      return {
        sign: (payload: unknown, secret: string, signOptions: unknown) => {
          signCalls.push({ payload, secret, options: signOptions });
          return options?.jwtSignResult ?? 'signed-token';
        },
      };
    }

    return originalLoad(request, parent, isMain);
  };

  try {
    const module = await import('../../../src/api/authController');
    return { validateAuth: module.validateAuth, signCalls };
  } finally {
    (Module as never as {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    })._load = originalLoad;
  }
}

test('validateAuth returns 400 when initData is missing', async () => {
  const { validateAuth } = await loadValidateAuth();
  const originalToken = process.env.BOT_TOKEN;
  process.env.BOT_TOKEN = 'bot-token';
  const req: MockRequest = { body: {} };
  const res = createResponse();

  try {
    validateAuth(req as never, res as never);
  } finally {
    process.env.BOT_TOKEN = originalToken;
  }

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: 'Missing initData' });
});

test('validateAuth returns 400 when BOT_TOKEN is missing', async () => {
  const { validateAuth } = await loadValidateAuth();
  const originalToken = process.env.BOT_TOKEN;
  delete process.env.BOT_TOKEN;
  const req: MockRequest = { body: { initData: 'init-data' } };
  const res = createResponse();

  try {
    validateAuth(req as never, res as never);
  } finally {
    process.env.BOT_TOKEN = originalToken;
  }

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: 'Missing initData' });
});

test('validateAuth returns 401 when initData is invalid', async () => {
  const { validateAuth } = await loadValidateAuth({
    validateInitDataResult: { valid: false },
  });
  const originalToken = process.env.BOT_TOKEN;
  process.env.BOT_TOKEN = 'bot-token';
  const req: MockRequest = { body: { initData: 'init-data' } };
  const res = createResponse();

  try {
    validateAuth(req as never, res as never);
  } finally {
    process.env.BOT_TOKEN = originalToken;
  }

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.payload, { error: 'Invalid initData' });
});

test('validateAuth returns 403 when telegram user is not admin', async () => {
  const { validateAuth } = await loadValidateAuth({
    validateInitDataResult: { valid: true, userId: '99' },
    isAdmin: false,
  });
  const originalToken = process.env.BOT_TOKEN;
  process.env.BOT_TOKEN = 'bot-token';
  const req: MockRequest = { body: { initData: 'init-data' } };
  const res = createResponse();

  try {
    validateAuth(req as never, res as never);
  } finally {
    process.env.BOT_TOKEN = originalToken;
  }

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.payload, { error: 'Not an admin' });
});

test('validateAuth signs jwt and returns token for admin user', async () => {
  const { validateAuth, signCalls } = await loadValidateAuth({
    validateInitDataResult: { valid: true, userId: '123' },
    isAdmin: true,
    jwtSecret: 'jwt-secret',
    jwtSignResult: 'signed-token',
  });
  const originalToken = process.env.BOT_TOKEN;
  process.env.BOT_TOKEN = 'bot-token';
  const req: MockRequest = { body: { initData: 'init-data' } };
  const res = createResponse();

  try {
    validateAuth(req as never, res as never);
  } finally {
    process.env.BOT_TOKEN = originalToken;
  }

  assert.equal(res.statusCode, undefined);
  assert.deepEqual(res.payload, {
    token: 'signed-token',
    telegramId: '123',
  });
  assert.deepEqual(signCalls, [{
    payload: { telegramId: '123' },
    secret: 'jwt-secret',
    options: { expiresIn: '1h' },
  }]);
});
