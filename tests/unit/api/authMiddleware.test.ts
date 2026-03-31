import test from 'node:test';
import assert from 'node:assert/strict';
import * as jwt from 'jsonwebtoken';
import { authMiddleware, getJwtSecret } from '../../../src/api/authMiddleware';

type MockRequest = {
  headers: {
    authorization?: string;
  };
  telegramId?: string;
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

test('getJwtSecret throws when JWT_SECRET is missing', () => {
  const originalSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  try {
    assert.throws(() => getJwtSecret(), /JWT_SECRET environment variable is not set/);
  } finally {
    process.env.JWT_SECRET = originalSecret;
  }
});

test('authMiddleware returns 401 when authorization header is missing', () => {
  const req: MockRequest = { headers: {} };
  const res = createResponse();
  let nextCalls = 0;

  authMiddleware(req as never, res as never, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 0);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.payload, { error: 'Unauthorized' });
});

test('authMiddleware returns 401 when token is invalid', () => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'secret';
  const req: MockRequest = {
    headers: {
      authorization: 'Bearer invalid-token',
    },
  };
  const res = createResponse();
  let nextCalls = 0;

  try {
    authMiddleware(req as never, res as never, () => {
      nextCalls += 1;
    });
  } finally {
    process.env.JWT_SECRET = originalSecret;
  }

  assert.equal(nextCalls, 0);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.payload, { error: 'Invalid token' });
});

test('authMiddleware verifies jwt and stores telegramId on request', () => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'secret';
  const token = jwt.sign({ telegramId: '42' }, 'secret');
  const req: MockRequest = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = createResponse();
  let nextCalls = 0;

  try {
    authMiddleware(req as never, res as never, () => {
      nextCalls += 1;
    });
  } finally {
    process.env.JWT_SECRET = originalSecret;
  }

  assert.equal(nextCalls, 1);
  assert.equal(req.telegramId, '42');
  assert.equal(res.statusCode, undefined);
});
