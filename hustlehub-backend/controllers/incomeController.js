const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const TIMEZONE = 'Africa/Johannesburg';
const round2 = (n) => Math.round(n * 100) / 100;

exports.getIncomeSummary = async (req, res) => {
  // aggregate() does not auto-cast like find(), so the id must be converted explicitly
  const freelancerId = new mongoose.Types.ObjectId(req.user.id);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const twelveMonthsAgo = new Date(startOfMonth);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const [result] = await Transaction.aggregate([
    { $match: { freelancer: freelancerId, status: 'completed' } },
    {
      $facet: {
        totals: [
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ],
        thisMonth: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ],
        monthly: [
          { $match: { createdAt: { $gte: twelveMonthsAgo } } },
          {
            $group: {
              _id: {
                year: { $year: { date: '$createdAt', timezone: TIMEZONE } },
                month: { $month: { date: '$createdAt', timezone: TIMEZONE } }
              },
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]
      }
    }
  ]);

  const totals = result.totals[0] || { total: 0, count: 0 };

  res.status(200).json({
    success: true,
    income: {
      currency: 'ZAR',
      totalIncome: round2(totals.total),
      bookingCount: totals.count,
      averagePerBooking: totals.count ? round2(totals.total / totals.count) : 0,
      thisMonth: round2(result.thisMonth[0]?.total || 0),
      monthly: result.monthly.map((m) => ({
        year: m._id.year,
        month: m._id.month,
        total: round2(m.total),
        count: m.count
      }))
    }
  });
};
