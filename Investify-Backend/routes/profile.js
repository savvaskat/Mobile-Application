const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Trade = require('../models/trades');

// Profile route
router.get('/api/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const trades = await Trade.find({ userId: user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            balance: user.balance || 0,
            trades: trades || [],
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err: err.stack });
    }
});

module.exports = router;