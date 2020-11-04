const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    verificationCode: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
});

let OTP = mongoose.model('OTP',otpSchema);

module.exports = OTP;