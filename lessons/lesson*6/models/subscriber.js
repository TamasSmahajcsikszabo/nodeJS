const mongoose = require("mongoose"),
    subscriberSchema = mongoose.Schema({
        name: String,
        email: String,
        zipcode: Number
    });

module.exports = mongoose.model("Subscriber", subscriberSchema);
