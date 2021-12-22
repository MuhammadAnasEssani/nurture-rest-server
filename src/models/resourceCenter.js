const mongoose = require('mongoose');

const resourceCenterSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
    resources: [
        {
            resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
        }
    ]
}, { timestamps: true});

module.exports = mongoose.model('ResourceCenter', resourceCenterSchema)