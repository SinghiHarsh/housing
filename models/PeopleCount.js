const mongoose = require('mongoose');
const peopleCountSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    },
    count: {
        type: Number
    }
});

const PeopleCount = mongoose.model("PeopleCount", peopleCountSchema);
module.exports = PeopleCount;