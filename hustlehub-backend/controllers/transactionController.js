const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

exports.getMyTransactions = async (req, res) => {
  const filter =
    req.user.role === 'client' ? { client: req.user.id } :
    req.user.role === 'freelancer' ? { freelancer: req.user.id } : {};

  const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    logger.info('Transactions viewed', {
    category: 'transaction',
    userId: req.user.id,
    role: req.user.role,
    count: transactions.length,
    ip: req.ip
  });
  res.status(200).json({ success: true, count: transactions.length, transactions });
};
