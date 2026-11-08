
const User = require('../models/User');
const Gig = require('../models/Gig');
const logger = require('../utils/logger');
const { audit } = require('../utils/audit');

exports.getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    audit('ADMIN_LISTED_USERS', { actorId: req.user.id, actorRole: req.user.role, ip: req.ip });

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
};

exports.deleteAnyGig = async (req, res) => {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
        return res.status(404).json({
            success: false,
            message: 'Gig not found'
        });
    }

    await gig.deleteOne();

    logger.info('Gig deleted by admin', { category: 'admin', adminId: req.user.id, gigId: req.params.id, ip: req.ip });
    audit('ADMIN_DELETED_GIG', { actorId: req.user.id, actorRole: req.user.role, targetId: req.params.id, ip: req.ip });
   
    res.status(200).json({
        success: true,
        message: 'Gig removed by admin'
    });
};
