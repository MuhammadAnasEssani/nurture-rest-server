const mongoose = require('mongoose');

const accountTipsSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
    tips: [
        {
            tip: { type: mongoose.Schema.Types.ObjectId, ref: 'Tips', required: true },
        }
    ]
}, { timestamps: true});

module.exports = mongoose.model('AccountTips', accountTipsSchema)