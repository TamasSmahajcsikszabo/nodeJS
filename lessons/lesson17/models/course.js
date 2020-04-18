const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    items: [],
    zipCode: {
        type: Number,
        min: [1000, "Zip Code too short"],
        max: [99999, "Zip Code too long!"]
    }
});

module.exports = mongoose.model("Course", courseSchema);

