import test from 'node:test';
import assert from 'node:assert/strict';
import { createTranslator, MessageKey, t } from '../../../src/i18n';

const validKey: MessageKey = 'start';
void validKey;

if (false) {
  // @ts-expect-error Проверка compile-time: неизвестный ключ запрещён.
  const invalidKey: MessageKey = 'invalid.key';
  void invalidKey;

  // @ts-expect-error Проверка compile-time: вызов t() с неизвестным ключом запрещён.
  t('invalid.key');
}

test('t prefers runtime value when it is non-empty', () => {
  const translator = createTranslator({
    getRuntimeText: () => 'runtime text',
    getRuntimeMap: () => ({ start: 'runtime text' }),
    logError: () => undefined,
  });

  const result = translator('start');
  assert.equal(result, 'runtime text');
});

test('t falls back to catalog value when runtime value is empty', () => {
  const translator = createTranslator({
    getRuntimeText: () => '',
    getRuntimeMap: () => ({ start: '' }),
    logError: () => undefined,
  });

  const result = translator('start');
  assert.notEqual(result, 'start');
});

test('t returns key and logs diagnostics when value is missing in both sources', () => {
  const logs: Array<{ label: string; payload: unknown }> = [];
  const translator = createTranslator({
    getRuntimeText: () => '',
    getRuntimeMap: () => ({}),
    logError: (label, payload) => {
      logs.push({ label, payload });
    },
  });

  const result = translator('missing.runtime.key' as MessageKey);

  assert.equal(result, 'missing.runtime.key');
  assert.equal(logs.length, 1);
  assert.equal(logs[0].label, '[i18n-missing-key]');
});

test('t treats empty runtime values as empty and uses catalog without logging', () => {
  const logs: unknown[] = [];
  const translator = createTranslator({
    getRuntimeText: () => '   ',
    getRuntimeMap: () => ({ start: '   ' }),
    logError: (_label, payload) => {
      logs.push(payload);
    },
  });

  const result = translator('start');
  assert.notEqual(result, 'start');
  assert.equal(logs.length, 0);
});
