const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    balance: { type: Number, default: 1000 },
    trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trade' }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);