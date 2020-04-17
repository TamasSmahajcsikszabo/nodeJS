const random = require('./random.js'),
    mongoose = require("mongoose"),
    Subscriber = require("./models/subscriber"),
    User = require("./models/user.js"),
    Course = require("./models/course");
mongoose.Promise = global.Promise;

var surenames = ['Smith', 'Taylor', 'Johns', 'Mellows', 'Small', 'Watson', 'Big', 'Green'],
    forenames = ['Anne', 'Susanne', 'Marge', 'Tim', 'Peter', 'John', 'Thomas', 'James', 'William'],
    usernames = ['Slender', 'Robin', 'CCLark', '486DX266', 'C3PO', 'R2D2', 'Moby', 'Tren', 'WillyVR'],
    postfix = ['Fan', 'GT', 'JR.', '-001', '-sy', 'LtD.'];
var zipCodes = random.randomBetween(1000, 99999, 35)

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true}
);

User.deleteMany({})
    .then((items) => console.log(`Removed ${items.n} items from the database!`))
            .then(() => {
        for (i = 0; i < 20; i++) {
            var params;
            let surename = random.randomPick(surenames),
                forename = random.randomPick(forenames),
                username = random.randomPick(usernames).concat(random.randomPick(postfix)),
                email = forename.concat(surename.concat("@gmail.com"));

            params = {
                username: username, 
                name: {
                    first: forename,
                    last: surename
                },
                email: email,
                zipCode: zipCodes[i]
            }

            User.register(params, "test", (error, user) => {
                if (user) {

                    console.log(`User ${user.username} logged into database.`)
                } else {
                    console.log(error.message)
                }
            }
            )
        }
        });

// mongoose.connection.close()
