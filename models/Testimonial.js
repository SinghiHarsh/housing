const mongoose = require('mongoose');
const Property = require('./Property');
const Student = require('./Student');

const testimonialSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: false
    }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;