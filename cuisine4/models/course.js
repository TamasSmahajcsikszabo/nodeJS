const mongoose = require('mongoose'),
    { Schema } = mongoose;

const courseSchema = new Schema({
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
    },
    maxStudents: {
        typr: Number,
        default: 0,
        min: [0, "Course cannot habe a negative number of students"]
    },
    Cost: {
        type: Number, 
        default: 0, 
        min: [0, "Course cannot habe a negative cost"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);

