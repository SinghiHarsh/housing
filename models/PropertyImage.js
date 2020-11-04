const mongoose = require('mongoose');
const Property = require('./Property');

const propertyImageSchema = mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
});

const PropertyImage = mongoose.model('PropertyImage', propertyImageSchema);

module.exports = PropertyImage;