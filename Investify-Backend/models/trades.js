const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});  

module.exports = mongoose.model('trade', tradeSchema);