const mongoose = require("mongoose"),
    subscriberSchema = mongoose.Schema({
        name: String,
        email: String,
        zipcode: Number
    }),
    courseSchema = mongoose.Schema({
        title: String,
        duration: Number,
        requirement: String,
        supplements: String
    });

exports.Subscriber= mongoose.model("Subscriber", subscriberSchema);
exports.Course = mongoose.model("Course", courseSchema);
