const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { calculateTax } = require('../utils/taxCalculator');

const TIMEZONE = 'Africa/Johannesburg';
const round2 = (n) => Math.round(n * 100) / 100;

/*
 * Income summary and SARS tax estimate.
 *
 * References:
 * MongoDB (2026) Aggregation Pipeline.
 * https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
 *
 * SARS (2026) Rates of Tax for Individuals.
 * https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/
 *
 * Tax estimates assume an individual younger than 65.
 * Other income, expenses and deductions are excluded.
 */

exports.getIncomeSummary = async (req, res) => {
  // Convert authenticated user's ID for MongoDB aggregation.
  const freelancerId = new mongoose.Types.ObjectId(req.user.id);

  // Uses Johannesburg local calendar dates for reporting.
  const now = new Date();
  const saToday = new Date(
    now.toLocaleString('en-US', { timeZone: TIMEZONE })
  );

  // Calculate month boundaries using South African Standard Time (UTC+02:00).
// This ensures accurate reporting regardless of the server's timezone.
const currentYear = saToday.getFullYear();
const currentMonth = saToday.getMonth();

const startOfMonth = new Date(
  `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00+02:00`
);

// Calculate the start of the 12-month reporting period.
const twelveMonthsAgoDate = new Date(
  Date.UTC(currentYear, currentMonth - 11, 1)
);

const twelveMonthsAgo = new Date(
  `${twelveMonthsAgoDate.getUTCFullYear()}-${String(
    twelveMonthsAgoDate.getUTCMonth() + 1
  ).padStart(2, '0')}-01T00:00:00+02:00`
);

  

  const taxYearStartYear =
    currentMonth >= 2 ? currentYear : currentYear - 1;

  // SARS tax year boundaries in South African Standard Time (UTC+02:00).
// Start is inclusive; end is exclusive.
const taxYearStart = new Date(
  `${taxYearStartYear}-03-01T00:00:00+02:00`
);

const taxYearEnd = new Date(
  `${taxYearStartYear + 1}-03-01T00:00:00+02:00`
);

  const [result] = await Transaction.aggregate([
    {
      $match: {
        freelancer: freelancerId,
        status: 'completed'
      }
    },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ],

        thisMonth: [
          {
            $match: {
              createdAt: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ],

        monthly: [
          {
            $match: {
              createdAt: { $gte: twelveMonthsAgo }
            }
          },
          {
            $group: {
              _id: {
                year: {
                  $year: {
                    date: '$createdAt',
                    timezone: TIMEZONE
                  }
                },
                month: {
                  $month: {
                    date: '$createdAt',
                    timezone: TIMEZONE
                  }
                }
              },
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              '_id.year': 1,
              '_id.month': 1
            }
          }
        ],

        // Only include completed transactions in the current tax year.
        taxYearIncome: [
          {
            $match: {
              createdAt: {
                $gte: taxYearStart,
                $lt: taxYearEnd
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]
      }
    }
  ]);

  const totals = result.totals[0] || {
    total: 0,
    count: 0
  };

  const currentTaxYearIncome = round2(
    result.taxYearIncome[0]?.total || 0
  );

  // Estimate tax using recorded tax-year income.
  // This is not a forecast of the full year's earnings.
  const taxEstimate = calculateTax(currentTaxYearIncome);

  res.status(200).json({
    success: true,
    income: {
      currency: 'ZAR',

      totalIncome: round2(totals.total),

      bookingCount: totals.count,

      averagePerBooking: totals.count
        ? round2(totals.total / totals.count)
        : 0,

      thisMonth: round2(
        result.thisMonth[0]?.total || 0
      ),

      monthly: result.monthly.map((m) => ({
        year: m._id.year,
        month: m._id.month,
        total: round2(m.total),
        count: m.count
      })),

      // Additional tax information for the Freelancer Dashboard.
      tax: {
        ...taxEstimate,
        taxYearStart: `${taxYearStartYear}-03-01`,
        taxYearEnd: `${taxYearStartYear + 1}-02-28`,
        taxYearIncome: currentTaxYearIncome,
        disclaimer:
          'Estimated tax based on recorded completed transactions. ' +
          'Actual SARS tax may differ due to deductions, other income, ' +
          'age and applicable rebates.'
      }
    }
  });
};