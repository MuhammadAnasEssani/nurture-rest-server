const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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
    hash_password: {
        type: String,
        required: true
    },
    resetLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'staff', 'vendor' ],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'requested'
    },
    contactNumber: { type: String },
    profilePicture: { type: String }
}, { timestamps: true });

userSchema.virtual('fullName')
.get(function(){
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: async function(password){
        return await bcrypt.compare(password, this.hash_password);
    }
}

module.exports = mongoose.model('User', userSchema)