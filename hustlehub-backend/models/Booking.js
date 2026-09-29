const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Snapshot of the gig at booking time, so later edits or deletion don't change history
  gigTitle: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

bookingSchema.index({ client: 1, createdAt: -1 });
bookingSchema.index({ freelancer: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
