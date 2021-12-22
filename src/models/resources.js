const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true,
    },
    resourceTitle: {
        type: String,
        required: true,
    },
    resourcePictures: [
        { img: { type: String }}
    ],
    Detail: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema)