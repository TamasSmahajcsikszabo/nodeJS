const mongoose = require('mongoose'),
    Subscriber = require('../models/subscriber.js'),
    Course = require('../models/course.js'),
    bcrypt = require('bcrypt'),
    passportLocalMongoose = require("passport-local-mongoose"),
    {Schema} = mongoose,

    userSchema = new Schema({
        username: {
            type: String, 
            trim: true
        },
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
        // password: {
        //     type: String,
        //     required: true
        // },
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

// mongoose.connect("mongodb://localhost:27017/recipe_db",
//         { useNewUrlParser  : true}
//         );
// var course;
// userSchema.virtual("subscribedCourse")
//     .get(function() {
//         Subscriber.findOne({
//             email: this.email
//         })
//             .then(subscriber => {
//                 return Subscriber.populate(subscriber, "courses");
//             })
//     .then(subscriber => {
//         course = subscriber.courses[0].title;
//     })
//         return course
//     });


// hook
userSchema.pre("save", function (next) {
    let user = this;
    if (user.subscribedAccount === undefined) {
        Subscriber.findOne({
            email: user.email
        })
            .then(subscriber  => {
                user.subscribedAccount = subscriber;
                next();
            })
            .catch(error => {
                console.log(`Error in connecting subscriber: ${error.message}`);
                next(error);
            })
    } else {
        next();
    }
});

//hashing hook
// userSchema.pre("save", function (next) {
//     let user = this;

//     bcrypt
//         .hash(user.password, 10)
//         .then(hash  => { 
//             console.log(`original: ${user.password}`)
//             user.password = hash;
//             console.log(`hashed: ${user.password}`)
//             next();
//         })
//         .catch(error  => {
//             console.log(`error in hashing password: ${error.message}`);
//             next(error);
//         })
// });

// userSchema.pre("save", function (next) {
//     let user = this;
//     bcrypt
//         .hash(user.email, 10)
//         .then(hash_email  => { 
//             console.log(`original: ${user.email}`)
//             user.email = hash_email;
//             console.log(`hashed: ${user.email}`)
//             next();
//         })
//         .catch(error  => {
//             console.log(`error in hashing email: ${error.message}`);
//             next(error);
//         });
// });

// userSchema.methods.compareEmail = function(inputEmail) {
//     let user = this;
//     console.log(`${inputEmail} compared with ${user.email}`)
//     return bcrypt.compare(user.email, inputEmail)
// }

// userSchema.methods.comparison = function(inputPassword) {
//     let user = this;
//     return bcrypt.compare(inputPassword, user.password);
// }

userSchema.plugin(passportLocalMongoose, {
    usernameField: "username"
})
module.exports = mongoose.model("User", userSchema);
