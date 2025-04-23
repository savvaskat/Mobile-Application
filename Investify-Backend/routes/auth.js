const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const router = express.Router();

// Signup route
router.post('/api/signup', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(409).json({ msg: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            passwordHash,
            balance: 1000,
            trades: [],
        });

        res.status(201).json({
            message: 'User created successfully',
            userId: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.stack });
    }
});

// Login route
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            userId: user._id,
            fullname: user.fullname,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err: err.stack });
    }
});

module.exports = router;