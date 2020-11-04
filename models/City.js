const mongoose = require('mongoose');
const citySchema = mongoose.Schema({
    cityName: {
        type: String,
        required: true,
        unique: true
    },
    countryName: {
        type: String,
        required: true,
    },
    localities: {
        type: Array
    },
    universities: {
        type: Array
    },
    description: {
        type: String
    }
});

const City = mongoose.model("City", citySchema);

module.exports = City;