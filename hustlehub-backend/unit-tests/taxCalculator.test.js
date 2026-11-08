/*
 * SARS Income Tax Calculator Unit Tests
 * Tests the tax calculator using Node.js's built-in test runner.
 *
 * References:
 * Node.js (2026) Test runner documentation.
 * Available at: https://nodejs.org/api/test.html
 *
 * South African Revenue Service (SARS) (2026)
 * Rates of Tax for Individuals.
 * Available at:
 * https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateTax } = require('../utils/taxCalculator');

// Test 1: No income should result in no tax.
test('Zero income returns zero tax', () => {
  const result = calculateTax(0);

  assert.equal(result.annualIncome, 0);
  assert.equal(result.estimatedTax, 0);
  assert.equal(result.afterTaxIncome, 0);
  assert.equal(result.effectiveTaxRate, 0);
});

// Test 2: Income below the tax threshold should not owe tax.
test('Low income produces zero tax after rebate', () => {
  const result = calculateTax(50000);

  assert.equal(result.estimatedTax, 0);
  assert.equal(result.afterTaxIncome, 50000);
});

// Test 3: Verify the amount displayed on our dashboard.
test('R150000 income calculates correct estimated tax', () => {
  const result = calculateTax(150000);

  assert.equal(result.taxBeforeRebate, 27000);
  assert.equal(result.primaryRebate, 17820);
  assert.equal(result.estimatedTax, 9180);
  assert.equal(result.afterTaxIncome, 140820);
  assert.equal(result.effectiveTaxRate, 6.12);
});

// Test 4: Verify progressive taxation across two brackets.
// Reference: SARS (2026) Rates of Tax for Individuals.
test('R300000 income uses progressive tax brackets', () => {
  const result = calculateTax(300000);

  assert.equal(result.taxBeforeRebate, 58392);
  assert.equal(result.estimatedTax, 40572);
  assert.equal(result.afterTaxIncome, 259428);
  assert.equal(result.effectiveTaxRate, 13.52);
});

// Test 5: Income at the first tax bracket boundary.
test('R245100 income calculates first bracket correctly', () => {
  const result = calculateTax(245100);

  assert.equal(result.taxBeforeRebate, 44118);
  assert.equal(result.estimatedTax, 26298);
});

// Test 6: Invalid negative income should be rejected.
test('Negative income is rejected', () => {
  assert.throws(
    () => calculateTax(-100),
    /Annual income must be a non-negative number/
  );
});

// Test 7: Invalid string input should be rejected.
test('String income is rejected', () => {
  assert.throws(
    () => calculateTax('150000'),
    /Annual income must be a non-negative number/
  );
});

// Test 8: Invalid numeric values should be rejected.
test('NaN and Infinity are rejected', () => {
  assert.throws(() => calculateTax(NaN));
  assert.throws(() => calculateTax(Infinity));
});

// Test 9: Verify the tax year and currency.
test('Tax result includes correct tax year and currency', () => {
  const result = calculateTax(150000);

  assert.equal(result.taxYear, '2026/2027');
  assert.equal(result.currency, 'ZAR');
});