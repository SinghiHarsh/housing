const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
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
        unique: true,
    },
    phoneNumber: {
        type: Number,
        // required: true,
        unique: true,
        sparse: true
    },
    countryCode: {
        type: Number
    },
    password: {
        type: String,
        // required: true
    },
    methodOfAuthentication: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        // required: true
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    methodId: String
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;