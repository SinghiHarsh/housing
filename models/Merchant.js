const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    status: {
        type: String
    },
    commission: {
        type: Number
    }
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;