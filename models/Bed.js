const mongoose = require('mongoose');

const bedSchema = mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    schedule: [[{
        type: Date
    }]]
});

const Bed = mongoose.model('Bed', bedSchema);

module.exports = Bed;