const mongoose = require('mongoose');

const returnPaymentSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },
    modeOfPayment: {
        type: String,
        required: true
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant"
    },
    amountPaid: {
        type: Number
    },
    commissionEarned: {
        type: Number
    }
}, 
{ timestamps: { createdAt: 'created_at' } 
});

const ReturnPayment = new mongoose.model("ReturnPayment", returnPaymentSchema);

module.exports = ReturnPayment;