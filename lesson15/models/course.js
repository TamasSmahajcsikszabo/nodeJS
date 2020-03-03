const mongoose = require("mongoose"),
    courseSchema = mongoose.Schema({
        title: String,
        duration: Number,
        requirement: String,
        supplements: String
    });

module.exports = mongoose.model("Course", courseSchema);
