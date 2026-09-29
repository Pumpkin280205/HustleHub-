const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'ZAR' },
  paymentMethod: { type: String, default: 'simulated' },
  status: { type: String, enum: ['completed', 'refunded'], default: 'completed' },
  reference: { type: String, required: true, unique: true }
}, { timestamps: true });

transactionSchema.index({ freelancer: 1, createdAt: -1 });
transactionSchema.index({ client: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
