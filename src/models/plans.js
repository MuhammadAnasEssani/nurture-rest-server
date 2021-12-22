const mongoose = require('mongoose');

const plansSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Monthly', '6 months', '12 months'],
        default: 'Monthly'
    },
}, { timestamps: true });

module.exports = mongoose.model('Plans', plansSchema)