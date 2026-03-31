import test from 'node:test';
import assert from 'node:assert/strict';
import { createNavigationStack } from '../../../src/utils/navigationStack';

test('navigationStack returns states in LIFO order', () => {
  const stack = createNavigationStack();

  stack.pushToStack('user-1', 'welcome');
  stack.pushToStack('user-1', 'faq');

  assert.equal(stack.popFromStack('user-1'), 'faq');
  assert.equal(stack.popFromStack('user-1'), 'welcome');
  assert.equal(stack.popFromStack('user-1'), null);
});

test('navigationStack clears user history completely', () => {
  const stack = createNavigationStack();

  stack.pushToStack('user-2', 'start');
  stack.pushToStack('user-2', 'participant');
  stack.clearUserNavigationStack('user-2');

  assert.equal(stack.popFromStack('user-2'), null);
});

test('navigationStack evicts oldest user entries after size limit', () => {
  const stack = createNavigationStack(2);

  for (let index = 0; index <= 2; index += 1) {
    stack.pushToStack(`user-${index}`, `state-${index}`);
  }

  assert.equal(stack.popFromStack('user-0'), null);
  assert.equal(stack.popFromStack('user-1'), 'state-1');
  assert.equal(stack.popFromStack('user-2'), 'state-2');
});
