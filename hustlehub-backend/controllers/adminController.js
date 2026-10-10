
const User = require('../models/User');
const Gig = require('../models/Gig');

exports.getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

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

    res.status(200).json({
        success: true,
        message: 'Gig removed by admin'
    });
};
