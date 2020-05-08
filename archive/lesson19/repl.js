const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");


mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
);

mongoose.Promise = global.Promise;
// Subscriber.deleteMany({})
    // .then((items) => {console.log(`${items.n} subscribers removed.`)})

// User.deleteMany({})
    // .then((items) => {console.log(`${items.n} users removed.`)})

var testUser;
var targetSubscriber;

User.deleteMany({ email: "thomastaylor@gmail.com" })
    .then((deleted) => console.log(`Deleted user accounts: ${deleted.n}`));

// User.create({   
//     name: {
//         first: "Thomas",
//         last: " Taylor "
//     },
//     email: "thomastaylor@gmail.com",
//     password: "pass123"
// })
//     .then(user => testUser = user)
//     .catch(error => console.log(error.message))
//     .then(() => {console.log(`Email used as key: ${testUser.email}`)})
//     .then(() => {
//         Subscriber.findOne({
//                     email: testUser.email 
//                 })
//             .then(subscriber => targetSubscriber = subscriber)
//             .then(() => {console.log('Matched subscriber data: \n',targetSubscriber)})
//             .then(() => {
//                 testUser.subscribedAccount = targetSubscriber;
//                 testUser.save();
//                 console.log(`The user account of ${testUser.fullName} updated!`)
//             });
//     });

// book variant:
User.create({   
    name: {
        first: "Anne",
        last: " Green "
    },
    email: "annegreen@gmail.com",
    zipCode: 18928, 
    password: "pass123"
})
    .then(user  => {
        testUser = user;
        return Subscriber.findOne({
            email: testUser.email
        })
    })
    .then(subscriber  => {
        testUser.subscribedAccount = subscriber;
        testUser.save().then(user  => console.log("user updated"))
    })
    .catch(error  => console.log(error.message))
