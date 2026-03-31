import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBody } from '../../../../src/api/validation/validateBody';
import { messageUpdateSchema } from '../../../../src/api/validation/messageSchema';

type MockRequest = {
  body: Record<string, unknown>;
};

type MockResponse = {
  statusCode?: number;
  payload?: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

test('validateBody passes sanitized data to next on success', () => {
  const middleware = validateBody(messageUpdateSchema);
  const req: MockRequest = {
    body: {
      value: 'Привет',
      description: '',
    },
  };
  const res: MockResponse = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  };
  let nextCalls = 0;

  middleware(req as never, res as never, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 1);
  assert.deepEqual(req.body, {
    value: 'Привет',
    description: undefined,
  });
  assert.equal(res.statusCode, undefined);
  assert.equal(res.payload, undefined);
});

test('validateBody returns 400 with flattened zod errors on invalid payload', () => {
  const middleware = validateBody(messageUpdateSchema);
  const req: MockRequest = {
    body: {
      value: '',
    },
  };
  const res: MockResponse = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  };
  let nextCalls = 0;

  middleware(req as never, res as never, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 0);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, {
    errors: {
      formErrors: [],
      fieldErrors: {
        value: ['Invalid input: expected string, received undefined'],
      },
    },
  });
});
