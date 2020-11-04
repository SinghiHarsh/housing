const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    bookingId: {
        type: String
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    selectedRoomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType'
    },
    selectedBeds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bed',
        required: true
    }],
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    individualCost: {
        type: Number,
        required: true
    },
    // Initial cost 
    totalCost: {
        type: Number,
        required: true
    },
    // Final cost after discount and taxes
    afterDiscountCost: {
        type: Number
    },
    // Discount amount
    discountCost: {
        type: Number
    },
    couponCodeApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    paymentStatus: {
        type: String,
        default: "PENDING"
    },
    taxAmount: {
        type: Number
    },
    razorpayOrderId: {
        type: String
    },
    moneyTransferedToMerchant: {
        type: Boolean
    },
    bookingUserDetails: {
        firstName: { type:String, required: true },
        lastName: { type: String },
        email: { type: String, required: true },
        contactNumber: { type: Number, required: true },
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        gender: { type: String, required: true },
        address: { type: String, required: true },
        whereDidYouHearAboutUs: { type: String }
    }
}, { timestamps: { createdAt: 'created_at' } });
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;