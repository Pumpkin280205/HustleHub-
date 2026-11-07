/*
 * SARS Income Tax Calculator
 * INSY7314 - HustleHub
 *
 * Calculates estimated annual income tax for South African
 * freelancers using progressive tax brackets.
 *
 * Reference:
 * South African Revenue Service (SARS) (2026)
 * Rates of Tax for Individuals.
 * Available at:
 * https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/
 *
 * Note: This is an estimate, not official tax advice.
 */

// SARS 2026/2027 annual income tax brackets
const TAX_BRACKETS = [
  { limit: 245100, rate: 0.18 },
  { limit: 383100, rate: 0.26 },
  { limit: 530200, rate: 0.31 },
  { limit: 695800, rate: 0.36 },
  { limit: 887000, rate: 0.39 },
  { limit: 1878600, rate: 0.41 },
  { limit: Infinity, rate: 0.45 }
];

// Primary rebate for taxpayers younger than 65
const PRIMARY_REBATE = 17820;

// Round monetary amounts to two decimal places
const round2 = (amount) =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

/**
 * Calculate estimated annual income tax.
 *
 * @param {number} annualIncome - Annual taxable income in ZAR.
 * @returns {object} Estimated tax information.
 */
const calculateTax = (annualIncome) => {

  // Reject invalid income values.
  if (
    typeof annualIncome !== 'number' ||
    !Number.isFinite(annualIncome) ||
    annualIncome < 0
  ) {
    throw new Error('Annual income must be a non-negative number.');
  }

  let remainingIncome = annualIncome;
  let previousLimit = 0;
  let taxBeforeRebate = 0;

  // Apply progressive tax rates.
  for (const bracket of TAX_BRACKETS) {

    const taxableAmount = Math.min(
      remainingIncome,
      bracket.limit - previousLimit
    );

    if (taxableAmount <= 0) {
      break;
    }

    taxBeforeRebate += taxableAmount * bracket.rate;

    remainingIncome -= taxableAmount;
    previousLimit = bracket.limit;
  }

  // Apply the SARS primary rebate.
  // Tax cannot become negative.
  const estimatedTax = Math.max(
    0,
    taxBeforeRebate - PRIMARY_REBATE
  );

  const afterTaxIncome = Math.max(
    0,
    annualIncome - estimatedTax
  );

  const effectiveTaxRate = annualIncome > 0
    ? (estimatedTax / annualIncome) * 100
    : 0;

  return {
    taxYear: '2026/2027',
    currency: 'ZAR',
    annualIncome: round2(annualIncome),
    taxBeforeRebate: round2(taxBeforeRebate),
    primaryRebate: PRIMARY_REBATE,
    estimatedTax: round2(estimatedTax),
    afterTaxIncome: round2(afterTaxIncome),
    effectiveTaxRate: round2(effectiveTaxRate)
  };
};

module.exports = {
  calculateTax
};