const mongoose = require('mongoose');

const tipsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Tips', tipsSchema)