const mongoose = require('mongoose');

const homePageFeatureSchema = mongoose.Schema({
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    }],
    propertyType: String
});

const HomePageFeature = mongoose.model('HomePageFeature', homePageFeatureSchema);

module.exports = HomePageFeature;