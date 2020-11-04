const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    uniqueId: {
        type: Number,
        unique: true,
        required: true
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Merchant"
    },
    propertyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: [Number],
        unique: true
    },
    features: [{
        type: String,
    }],
    additionalFeatures: [{
        type: String,
    }],
    condition: {
        type: String,
    },
    description: {
        type: String,
    },
    thumbnail: String,
    propertyImages: [String],
    enabled: {
        type: Boolean,
        default: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
    },
    localities: {
        type: Array
    },
    universities: {
        type: Array
    },
    propertyType: {
        type: String,
        required: true
    },
    visitedCount:{
        type: Number,
        default: 0
    },
    priority: {
        type: Number,
        enum: [1,0],
        dafault: 0
    }
});

propertySchema.index({ location: "2dsphere" });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;