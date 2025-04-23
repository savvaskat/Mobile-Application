const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Trade = require('../models/trades');

// Trade route
router.post('/api/trade', async (req, res) => {
    try {
        const { email, type, coin, amount, price } = req.body;

        if (!email || !type || !coin || !amount || !price) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const quantity = parseFloat(amount);
        const unitPrice = parseFloat(price);
        const total = quantity * unitPrice;

        if (isNaN(quantity) || isNaN(unitPrice)) {
            return res.status(400).json({ msg: 'Invalid amount or price' });
        }

        if (type == 'buy') {
            if (user.balance < total) {
                return res.status(400).json({ msg: 'Insufficient balance' });
            }
            user.balance -= total;
        } else if (type == 'sell') {
            user.balance += total;
        } else {
            return res.status(400).json({ msg: 'Invalid trade type' });
        }

        const trade = new Trade({
            userId: user._id,
            type,
            coin,
            amount: quantity,
            price: unitPrice,
            total,
            timestamp: new Date(),
        });

        await trade.save();
        await user.save();

        res.status(200).json({ msg: 'Trade successful', balance: user.balance });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err: err.stack });
    }
});

module.exports = router;