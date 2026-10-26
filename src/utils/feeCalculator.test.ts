import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeeInput, formatFee, calculateTotalFee, validateFeeSum } from './feeCalculator.ts';

test('parseFeeInput correctly handles strings with dollar signs and decimals', () => {
  assert.equal(parseFeeInput('$20.00'), 20);
  assert.equal(parseFeeInput('213.50'), 213.5);
  assert.equal(parseFeeInput('invalid'), 0);
  assert.equal(parseFeeInput(''), 0);
});

test('formatFee formats numbers and strings to two decimal places', () => {
  assert.equal(formatFee(20), '20.00');
  assert.equal(formatFee('213'), '213.00');
  assert.equal(formatFee(1.5), '1.50');
});

test('calculateTotalFee matches Nevada DMV standard receipt values', () => {
  const sampleFees = {
    plateRenewal: 20.0,
    registrationFee: 33.0,
    basicGovServicesTax: 213.0,
    technologyFee: 1.0,
  };
  const total = calculateTotalFee(sampleFees);
  assert.equal(total, 267.0);
  assert.equal(validateFeeSum(sampleFees, 267.0), true);
  assert.equal(validateFeeSum(sampleFees, '267.00'), true);
  assert.equal(validateFeeSum(sampleFees, 200.0), false);
});
