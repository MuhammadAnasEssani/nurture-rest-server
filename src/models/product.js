const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    offer: { type: Number },
    productPictures: [
        { img: { type: String }}
    ],
    reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          email: {
            type: String,
          },
          rating: {
            type: Number,
          },
          comment: {
            type: String,
          },
        },
      ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdByRole: {type: String, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedByRole: {type: String},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema)