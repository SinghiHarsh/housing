const mongoose = require('mongoose');

const featuresListSchema = mongoose.Schema({
    features: Array
});

const FeaturesList = mongoose.model('FeaturesList', featuresListSchema);

module.exports = FeaturesList;
