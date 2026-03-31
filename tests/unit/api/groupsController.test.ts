import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';

type CreateGroup = typeof import('../../../src/api/groupsController').createGroup;

type MockRequest = {
  body: Record<string, unknown>;
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

async function loadCreateGroup(options?: {
  existingKeys?: string[];
  slug?: string;
  createResult?: Record<string, unknown>;
  createError?: Error;
}): Promise<{
  createGroup: CreateGroup;
  createCalls: unknown[];
  getInvalidateCalls: () => number;
}> {
  const createCalls: unknown[] = [];
  let invalidateCalls = 0;
  const existingKeys = new Set(options?.existingKeys ?? []);
  const originalLoad = (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load;
  const modulePath = require.resolve('../../../src/api/groupsController');
  delete require.cache[modulePath];

  (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load = (request, parent, isMain) => {
    if (request === '../db/groupsRepo') {
      return {
        getGroupByKey: (key: string) => (existingKeys.has(key) ? { key } : null),
        createGroup: (data: Record<string, unknown>) => {
          createCalls.push(data);
          if (options?.createError) {
            throw options.createError;
          }
          return options?.createResult ?? { id: 1, ...data };
        },
      };
    }

    if (request === '../db/dataProvider') {
      return {
        invalidateGroups: () => {
          invalidateCalls += 1;
        },
      };
    }

    if (request === '../utils/slugify') {
      return {
        slugify: () => options?.slug ?? 'generated-key',
      };
    }

    return originalLoad(request, parent, isMain);
  };

  try {
    const module = await import('../../../src/api/groupsController');
    return {
      createGroup: module.createGroup,
      createCalls,
      getInvalidateCalls: () => invalidateCalls,
    };
  } finally {
    (Module as never as {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    })._load = originalLoad;
  }
}

test('createGroup generates key from name when key is absent', async () => {
  const loaded = await loadCreateGroup({
    slug: 'moskva-center',
  });
  const req: MockRequest = {
    body: {
      type: 'aa',
      name: 'Москва Центр',
      address: 'ул. Пушкина',
      city: 'Москва',
    },
  };
  const res = createResponse();

  loaded.createGroup(req as never, res as never);

  assert.deepEqual(loaded.createCalls, [{
    type: 'aa',
    name: 'Москва Центр',
    address: 'ул. Пушкина',
    city: 'Москва',
    key: 'group_moskva-center',
  }]);
  assert.equal(res.statusCode, 201);
  assert.equal(loaded.getInvalidateCalls(), 1);
});

test('createGroup adds numeric suffix when generated key already exists', async () => {
  const loaded = await loadCreateGroup({
    slug: 'moskva-center',
    existingKeys: ['group_moskva-center'],
  });
  const req: MockRequest = {
    body: {
      type: 'aa',
      name: 'Москва Центр',
      address: 'ул. Пушкина',
      city: 'Москва',
    },
  };
  const res = createResponse();

  loaded.createGroup(req as never, res as never);

  assert.deepEqual(loaded.createCalls, [{
    type: 'aa',
    name: 'Москва Центр',
    address: 'ул. Пушкина',
    city: 'Москва',
    key: 'group_moskva-center-2',
  }]);
});

test('createGroup invalidates cache and returns created group payload', async () => {
  const createdGroup = { id: 12, key: 'custom', name: 'Группа' };
  const loaded = await loadCreateGroup({
    createResult: createdGroup,
  });
  const req: MockRequest = {
    body: {
      key: 'custom',
      type: 'aa',
      name: 'Группа',
      address: 'ул. Пушкина',
      city: 'Москва',
    },
  };
  const res = createResponse();

  loaded.createGroup(req as never, res as never);

  assert.equal(loaded.getInvalidateCalls(), 1);
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.payload, createdGroup);
});

test('createGroup returns 400 when repository throws', async () => {
  const loaded = await loadCreateGroup({
    createError: new Error('duplicate key'),
  });
  const req: MockRequest = {
    body: {
      key: 'custom',
      type: 'aa',
      name: 'Группа',
      address: 'ул. Пушкина',
      city: 'Москва',
    },
  };
  const res = createResponse();

  loaded.createGroup(req as never, res as never);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: 'duplicate key' });
});
