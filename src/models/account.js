const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const accountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase:true
    },
    address: {
        name: {
          type: String,
          required: true,
          min: 3,
          max: 50,
        },
        zipCode: {
          type: String,
          required: true,
          trim: true,
        },
        address: {
          type: String,
          required: true,
          trim: true,
          min: 10,
          max: 100,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
        },
      },
    profilePicture: { type: String },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans', required: true},
}, { timestamps: true });

userSchema.virtual('fullName')
.get(function(){
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Account', accountSchema)