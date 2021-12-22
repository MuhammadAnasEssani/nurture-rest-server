const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingredient: {
        type: String,
        required: true,
    },
    directions: {
        type: String,
        required: true,
    },
    offer: { type: Number },
    productPictures: [
        { img: { type: String }}
    ],
    video: {type: String },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans', required: true},
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema)