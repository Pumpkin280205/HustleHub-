const crypto = require('crypto');
const Gig = require('../models/Gig');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

// Returns the query filter that limits results to the current user's own records
const ownFilter = (user) => {
  if (user.role === 'client') return { client: user.id };
  if (user.role === 'freelancer') return { freelancer: user.id };
  return {}; // admin sees everything
};

exports.createBooking = async (req, res) => {
  const gig = await Gig.findById(req.body.gigId);
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

  // Price, freelancer and title all come from the database, never from the request
  const booking = await Booking.create({
    gig: gig._id,
    client: req.user.id,
    freelancer: gig.freelancer,
    gigTitle: gig.title,
    amount: gig.price
  });

  let transaction;
  try {
    transaction = await Transaction.create({
      booking: booking._id,
      client: req.user.id,
      freelancer: gig.freelancer,
      amount: booking.amount,
      reference: `TXN-${crypto.randomUUID()}`
    });
  } catch (err) {
    // Never leave a booking without its transaction
    await booking.deleteOne();
    throw err;
  }

  res.status(201).json({
    success: true,
    message: 'Booking confirmed (simulated payment)',
    booking,
    transaction
  });
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find(ownFilter(req.user))
    .populate('client', 'email')
    .populate('freelancer', 'email')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bookings.length, bookings });
};

exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('client', 'email')
    .populate('freelancer', 'email');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  // Only the two people involved in a booking (or an admin) may see it
  const isParty = [booking.client._id.toString(), booking.freelancer._id.toString()].includes(req.user.id);
  if (!isParty && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You do not have access to this booking' });
  }

  res.status(200).json({ success: true, booking });
};
