const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true
    },
    couponType: {
        type: String,
        required: true
    },
    offerAmount: {
        type: Number,
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    minimumBookingAmount: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    }
})

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
/*
    Coupon code,
    discountPercentage (or) flatAmount
    coupon type (FLAT or PERCENTAGE),
        FLAT - subtract the discount amount
        PERCENTAGE - deduct the percentage value

    REQUIRED ID FIELDS
        property id (coupons added by which merchant)

    minimumbookingamount
*/