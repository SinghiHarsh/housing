const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    gender: {
        type: String
    },
    role: {
        type: String,
        default: "sub-admin"
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;