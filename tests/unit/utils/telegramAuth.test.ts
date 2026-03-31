import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateInitData } from '../../../src/utils/telegramAuth';

function buildInitData(
  botToken: string,
  entries: Record<string, string>,
): string {
  const params = new URLSearchParams(entries);
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  params.set('hash', hash);
  return params.toString();
}

test('validateInitData accepts valid signed payload and returns userId', () => {
  const botToken = 'bot-token';
  const now = Math.floor(Date.now() / 1000);
  const initData = buildInitData(botToken, {
    auth_date: String(now),
    query_id: 'AAEAAAE',
    user: JSON.stringify({ id: 12345, first_name: 'Test' }),
  });

  assert.deepEqual(validateInitData(initData, botToken), {
    valid: true,
    userId: '12345',
  });
});

test('validateInitData rejects payload without hash', () => {
  const result = validateInitData('auth_date=1&user=%7B%22id%22%3A1%7D', 'bot-token');

  assert.deepEqual(result, { valid: false });
});

test('validateInitData rejects payload with invalid hash', () => {
  const botToken = 'bot-token';
  const now = Math.floor(Date.now() / 1000);
  const initData = buildInitData(botToken, {
    auth_date: String(now),
    user: JSON.stringify({ id: 77 }),
  }).replace(/hash=[^&]+/, 'hash=broken');

  assert.deepEqual(validateInitData(initData, botToken), { valid: false });
});

test('validateInitData rejects expired auth_date', () => {
  const botToken = 'bot-token';
  const initData = buildInitData(botToken, {
    auth_date: String(Math.floor(Date.now() / 1000) - 301),
    user: JSON.stringify({ id: 77 }),
  });

  assert.deepEqual(validateInitData(initData, botToken), { valid: false });
});

test('validateInitData rejects malformed user json after successful signature check', () => {
  const botToken = 'bot-token';
  const now = Math.floor(Date.now() / 1000);
  const initData = buildInitData(botToken, {
    auth_date: String(now),
    user: '{bad-json}',
  });

  assert.deepEqual(validateInitData(initData, botToken), { valid: false });
});

test('validateInitData accepts valid signed payload without user object', () => {
  const botToken = 'bot-token';
  const now = Math.floor(Date.now() / 1000);
  const initData = buildInitData(botToken, {
    auth_date: String(now),
    query_id: 'AAEAAAE',
  });

  assert.deepEqual(validateInitData(initData, botToken), { valid: true });
});
