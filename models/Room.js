const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true
    },
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;