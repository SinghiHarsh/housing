const mongoose = require('mongoose');
const Student = require("./Student");

const forgotPasswordSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    uniqueCode: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;