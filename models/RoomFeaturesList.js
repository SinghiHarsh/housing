const mongoose = require('mongoose');

const roomFeaturesListSchema = mongoose.Schema({
    features: Array
});

const RoomFeaturesList = mongoose.model('RoomFeaturesList', roomFeaturesListSchema);

module.exports = RoomFeaturesList;
