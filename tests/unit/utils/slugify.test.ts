import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify, transliterate } from '../../../src/utils/slugify';

test('transliterate converts cyrillic text to latin words', () => {
  assert.equal(transliterate('Привет мир'), 'privet-mir');
  assert.equal(transliterate('Группа АА 24/7'), 'gruppa-aa-24-7');
});

test('slugify removes unsupported symbols and collapses separators', () => {
  assert.equal(slugify('  Группа   АА!!!  '), 'gruppa-aa');
  assert.equal(slugify('Москва / Центр #1'), 'moskva-tsentr-1');
});
