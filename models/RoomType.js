const mongoose = require('mongoose');

const roomTypeSchema = mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    roomImages: [String],
    bedCount: {
        type: Number,
        required: true,
    },
    roomTypeName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    availableForSharing: {
        type: Boolean,
        // required: true,
    },
    minimumBookingDuration: {
        type: Number,
        default: 30,
    },
    perPersonCostPerMonth: {
        type: Number,
        required: true,
    },
    features: {
        type: Array
    },
    disable: {
        type: Boolean,
        default: false,
        required: true
    }
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;