const mongoose = require('mongoose'),
    Subscriber = require('../models/subscriber.js'),
    Course = require('../models/course.js'),
    {Schema} = mongoose,

    userSchema = new Schema({
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
        email: {
            type: String, 
            required: true, 
            lowercase: true, 
            unique: true
        },
        zipCode: {
            type: Number,
            min: [1000, "Zip code too short"],
            max: 99999
        },
        password: {
            type: String,
            required: true
        },
        courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
        subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"}
    }, {
        timestamps: true
    });


userSchema.methods.nameLength = function() {
        return this.name.first.length + this.name.last.length;
}

userSchema.virtual("fullName")
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
    });

mongoose.connect("mongodb://localhost:27017/recipe_db",
        { useNewUrlParser  : true}
        );
var course;
userSchema.virtual("subscribedCourse")
    .get(function() {
        Subscriber.findOne({
            email: this.email
        })
            .then(subscriber => {
                return Subscriber.populate(subscriber, "courses");
            })
    .then(subscriber => {
        course = subscriber.courses[0].title;
    })
        return course
    });

module.exports = mongoose.model("User", userSchema);
