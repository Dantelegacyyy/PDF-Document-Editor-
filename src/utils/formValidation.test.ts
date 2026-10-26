import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeField, validateVin, validateYear, formatAddressMultiline } from './formValidation.ts';

test('sanitizeField forces uppercase for DMV compliance', () => {
  assert.equal(sanitizeField('506r41'), '506R41');
  assert.equal(sanitizeField('lumina'), 'LUMINA');
  assert.equal(sanitizeField('mixed 123 abc', false), 'mixed 123 abc');
});

test('validateVin checks length and standard rules', () => {
  assert.equal(validateVin('2G1WL52J0Y1240002').valid, true);
  assert.equal(validateVin('SHORTVIN').valid, false);
  assert.equal(validateVin('').valid, false);
});

test('validateYear checks 4-digit valid year', () => {
  assert.equal(validateYear('2000').valid, true);
  assert.equal(validateYear('2023').valid, true);
  assert.equal(validateYear('99').valid, false);
  assert.equal(validateYear('abcd').valid, false);
});

test('formatAddressMultiline splits lines and trims', () => {
  const raw = 'RUBEN AGUILAR\n5524 BIG SEA ST\nLAS VEGAS, NV 89110\n';
  const lines = formatAddressMultiline(raw);
  assert.equal(lines.length, 3);
  assert.equal(lines[0], 'RUBEN AGUILAR');
  assert.equal(lines[1], '5524 BIG SEA ST');
  assert.equal(lines[2], 'LAS VEGAS, NV 89110');
});
