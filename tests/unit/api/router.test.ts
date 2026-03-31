import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';

type RouteCall = {
  method: 'get' | 'post' | 'put' | 'delete' | 'use';
  path?: string;
  handlers: unknown[];
};

async function loadRecordedRoutes(): Promise<RouteCall[]> {
  const routes: RouteCall[] = [];
  const authMiddleware = Symbol('authMiddleware');
  const validateBody = (schema: unknown) => ({ kind: 'validateBody', schema });
  const originalLoad = (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load;
  const modulePath = require.resolve('../../../src/api/router');
  delete require.cache[modulePath];

  (Module as never as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  })._load = (request, parent, isMain) => {
    if (request === 'express') {
      return {
        Router: () => ({
          get: (path: string, ...handlers: unknown[]) => routes.push({ method: 'get', path, handlers }),
          post: (path: string, ...handlers: unknown[]) => routes.push({ method: 'post', path, handlers }),
          put: (path: string, ...handlers: unknown[]) => routes.push({ method: 'put', path, handlers }),
          delete: (path: string, ...handlers: unknown[]) => routes.push({ method: 'delete', path, handlers }),
          use: (...handlers: unknown[]) => routes.push({ method: 'use', handlers }),
        }),
      };
    }

    if (request === './authMiddleware') {
      return { authMiddleware };
    }

    if (request === './validation/validateBody') {
      return { validateBody };
    }

    if (request === './validation/groupSchema') {
      return { groupCreateSchema: 'groupCreateSchema', groupUpdateSchema: 'groupUpdateSchema' };
    }

    if (request === './validation/schedulesSchema') {
      return { schedulesReplaceSchema: 'schedulesReplaceSchema' };
    }

    if (request === './validation/messageSchema') {
      return { messageUpdateSchema: 'messageUpdateSchema' };
    }

    if (request === './validation/urlSchema') {
      return { urlUpdateSchema: 'urlUpdateSchema' };
    }

    if (request === './validation/settingSchema') {
      return { settingUpdateSchema: 'settingUpdateSchema' };
    }

    if (request === './validation/adminSchema') {
      return { adminCreateSchema: 'adminCreateSchema' };
    }

    if (request === './authController') {
      return { validateAuth: Symbol('validateAuth') };
    }

    if (request === './groupsController') {
      return {
        listGroups: Symbol('listGroups'),
        getGroup: Symbol('getGroup'),
        createGroup: Symbol('createGroup'),
        updateGroup: Symbol('updateGroup'),
        deleteGroup: Symbol('deleteGroup'),
        replaceSchedules: Symbol('replaceSchedules'),
      };
    }

    if (request === './messagesController') {
      return {
        listMessages: Symbol('listMessages'),
        updateMessage: Symbol('updateMessage'),
      };
    }

    if (request === './urlsController') {
      return {
        listUrls: Symbol('listUrls'),
        updateUrl: Symbol('updateUrl'),
      };
    }

    if (request === './settingsController') {
      return {
        listSettings: Symbol('listSettings'),
        updateSetting: Symbol('updateSetting'),
      };
    }

    if (request === './adminsController') {
      return {
        listAdmins: Symbol('listAdmins'),
        addAdmin: Symbol('addAdmin'),
        removeAdmin: Symbol('removeAdmin'),
      };
    }

    if (request === './usersController') {
      return {
        listUsers: Symbol('listUsers'),
        getUserActions: Symbol('getUserActions'),
        getStats: Symbol('getStats'),
      };
    }

    return originalLoad(request, parent, isMain);
  };

  try {
    await import('../../../src/api/router');
    return routes;
  } finally {
    (Module as never as {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    })._load = originalLoad;
  }
}

test('router registers public health endpoint before auth middleware', async () => {
  const routes = await loadRecordedRoutes();

  assert.equal(routes[0].method, 'post');
  assert.equal(routes[0].path, '/auth/validate');
  assert.equal(routes[1].method, 'get');
  assert.equal(routes[1].path, '/health');
  assert.equal(routes[2].method, 'use');
});

test('router protects resource routes with auth middleware', async () => {
  const routes = await loadRecordedRoutes();

  const authUseIndex = routes.findIndex(route => route.method === 'use');
  const protectedGroupsIndex = routes.findIndex(
    route => route.method === 'get' && route.path === '/groups',
  );

  assert.notEqual(authUseIndex, -1);
  assert.notEqual(protectedGroupsIndex, -1);
  assert.ok(authUseIndex < protectedGroupsIndex);
});

test('router wires validateBody for mutating routes that require schemas', async () => {
  const routes = await loadRecordedRoutes();
  const postGroups = routes.find(route => route.method === 'post' && route.path === '/groups');
  const putMessages = routes.find(route => route.method === 'put' && route.path === '/messages/:key');

  assert.deepEqual(postGroups?.handlers[0], {
    kind: 'validateBody',
    schema: 'groupCreateSchema',
  });
  assert.deepEqual(putMessages?.handlers[0], {
    kind: 'validateBody',
    schema: 'messageUpdateSchema',
  });
});
