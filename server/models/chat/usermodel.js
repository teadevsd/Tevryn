const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 5
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    bio: {
        type: String,
        default: 'Hey There! I am using TeaChat App'
    },
    avatar: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        required: true
    },
    lastSeen: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});


const User = mongoose.model('Userteachat', userSchema);

module.exports = User;