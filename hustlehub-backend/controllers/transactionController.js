const Transaction = require('../models/Transaction');

exports.getMyTransactions = async (req, res) => {
  const filter =
    req.user.role === 'client' ? { client: req.user.id } :
    req.user.role === 'freelancer' ? { freelancer: req.user.id } : {};

  const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: transactions.length, transactions });
};
