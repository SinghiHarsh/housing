const mongoose = require('mongoose');

const merchantForgotPasswordSchema = mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchant'
    },
    uniqueCode: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const MerchantForgotPassword = mongoose.model('MerchantForgotPassword', merchantForgotPasswordSchema);

module.exports = MerchantForgotPassword;