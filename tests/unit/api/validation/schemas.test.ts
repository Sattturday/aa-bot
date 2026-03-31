import test from 'node:test';
import assert from 'node:assert/strict';
import { adminCreateSchema } from '../../../../src/api/validation/adminSchema';
import { groupCreateSchema } from '../../../../src/api/validation/groupSchema';
import { schedulesReplaceSchema } from '../../../../src/api/validation/schedulesSchema';
import { urlUpdateSchema } from '../../../../src/api/validation/urlSchema';

test('adminCreateSchema coerces numeric telegram_id to string', () => {
  const result = adminCreateSchema.safeParse({
    telegram_id: 123456,
    name: 'Admin',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, {
      telegram_id: '123456',
      name: 'Admin',
    });
  }
});

test('groupCreateSchema rejects invalid phone format', () => {
  const result = groupCreateSchema.safeParse({
    key: 'group_1',
    type: 'aa',
    name: 'Группа',
    address: 'Улица 1',
    city: 'Москва',
    phone: '+79991234567',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.flatten().fieldErrors, {
      phone: ['телефон в формате +7 (XXX) XXX-XX-XX'],
    });
  }
});

test('schedulesReplaceSchema accepts valid weekly schedules', () => {
  const result = schedulesReplaceSchema.safeParse({
    schedules: [
      { days: ['Пн', 'Ср'], time: '19:30' },
      { days: ['Сб'], time: '10:00' },
    ],
  });

  assert.equal(result.success, true);
});

test('urlUpdateSchema rejects non-url values', () => {
  const result = urlUpdateSchema.safeParse({
    value: 'not-a-url',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.flatten().fieldErrors, {
      value: ['value должен быть валидным URL'],
    });
  }
});
