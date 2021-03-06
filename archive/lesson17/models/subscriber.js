const mongoose = require("mongoose"),
    // adding validators to the data model:
    subscriberSchema = mongoose.Schema({
        name: {
            type: String, 
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true, //to make the database not case-sensitive
            unique: true
        },
        zipCode: {
            type: Number, 
            min: [1000, "Zip code too short"],
            max: [99999, "Zip code too long"]
        },
        courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}] // one model referencing the other is enough, no need to reference Subscriber to Course
        // the brackets singify an array of objects, removing them makes the object expecting one course item
    })

// adding instance methods
subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`
}
subscriberSchema.methods.findLocalSubscribers = function() {
    return this.model("Subscriber")
        .find({ZipCode: this.zipCode})
        .exec()
}
module.exports = mongoose.model("Subscriber", subscriberSchema);
