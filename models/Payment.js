const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    razorpay_order_id: {
        type: String
    },
    razorpay_payment_id: {
        type: String
    },
    razorpay_signature: {
        type: String
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;