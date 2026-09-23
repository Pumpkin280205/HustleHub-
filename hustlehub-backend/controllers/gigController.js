const Gig = require('../models/Gig');

// Shared helper: load gig and confirm ownership
const findOwnedGig = async (gigId, userId) => {
  const gig = await Gig.findById(gigId);
  if (!gig) return { status: 404, message: 'Gig not found' };
  if (gig.freelancer.toString() !== userId) return { status: 403, message: 'You do not own this gig' };
  return { gig };
};

exports.getAllGigs = async (req, res) => {
  const gigs = await Gig.find().populate('freelancer', 'email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: gigs.length, gigs });
};

exports.getGigById = async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate('freelancer', 'email');
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
  res.status(200).json({ success: true, gig });
};

exports.getMyGigs = async (req, res) => {
  const gigs = await Gig.find({ freelancer: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: gigs.length, gigs });
};

exports.createGig = async (req, res) => {
  const gig = await Gig.create({ ...req.body, freelancer: req.user.id }); // owner from TOKEN
  res.status(201).json({ success: true, message: 'Gig created', gig });
};

exports.updateGig = async (req, res) => {
  const result = await findOwnedGig(req.params.id, req.user.id);
  if (!result.gig) return res.status(result.status).json({ success: false, message: result.message });

  Object.assign(result.gig, req.body);   // req.body is already whitelisted by Joi
  await result.gig.save();
  res.status(200).json({ success: true, message: 'Gig updated', gig: result.gig });
};

exports.deleteGig = async (req, res) => {
  const result = await findOwnedGig(req.params.id, req.user.id);
  if (!result.gig) return res.status(result.status).json({ success: false, message: result.message });

  await result.gig.deleteOne();
  res.status(200).json({ success: true, message: 'Gig deleted' });
};
