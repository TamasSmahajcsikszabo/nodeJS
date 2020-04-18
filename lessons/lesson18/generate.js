const random = require('./random.js'),
    mongoose = require("mongoose"),
    Subscriber = require("./models/subscriber"),
    Course = require("./models/course");

mongoose.Promise = global.Promise;

var surenames = ['Smith', 'Taylor', 'Johns', 'Mellows', 'Small', 'Watson', 'Big', 'Green'],
    forenames = ['Anne', 'Susanne', 'Marge', 'Tim', 'Peter', 'John', 'Thomas', 'James', 'William'],
    course_titles = ['LEGO basics', 'Boardgame for beginners', 'Board game design', 'Guitar for the untalented', 'How to recognise nerds'],
    items = ['sword', 'dice', 'spear', 'dagger', 'guitar pick', 'fake skull', 'electric guitar', 'lab equipemnt', 'tubes', 'bricks', 'meeples', 'board', 'a deck of cards', 'ambient music CD', 'custome'];


var names = random.createNames(surenames, forenames, 35)
// console.log(names)
// console.log(typeof names)

var emails = random.deriveEmails(names)
// console.og(emails)

var zipCodes = random.randomBetween(1000, 99999, 35)
// console.log(zipCodes)


var pickedCourse, pickedUser;

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true}
);

Subscriber.deleteMany({})
    .then((items) => console.log(`Removed ${items.n} items from the database!`))
            .then(() => {
        for (i = 0; i < 20; i++) {
            Subscriber.create({
                name: names[i],
                email: emails[i],
                zipCode: zipCodes[i]
            })
            console.log(`User ${names[i]} logged into database.`)
        }
        })

Course.deleteMany({})
    .then((items) => console.log(`${items.n} courses removed from the database.`)) 
    .then(() => {
         return Course.create({
            title: 'Lego basics',
            description: 'How to build LEGO sets for complete beginners and weirdos',
            zipCode: random.randomPick(zipCodes),
            items: [random.randomPick(items), random.randomPick(items), random.randomPick(items)]
        })
    })
    .then(course => console.log(`${course.title} added to the database.`)) 
    .catch(error  => console.log(error.message))
    .then(() => {
        return Course.create({
            title: 'Boardgame for beginners',
            description: 'Discover the inner child',
            zipCode: random.randomPick(zipCodes),
            items: [random.randomPick(items), random.randomPick(items), random.randomPick(items)]
        })
    })
    .then(course  => console.log(`${course.title} added to the database.`)) 
    .catch(error  => console.log(error.message))
    .then(() => {
        return Course.create({
            title: 'Board game design',
            description: 'Make your childhood dream true',
            zipCode: random.randomPick(zipCodes),
            items: [random.randomPick(items), random.randomPick(items), random.randomPick(items)]
        })
    })
    .then(course  => console.log(`${course.title} added to the database.`)) 
    .catch(error  => console.log(error.message))
    .then(() => {
        return Course.create({
            title: 'Guitar for the untalented',
            description: 'Never too late for a musical career',
            zipCode: random.randomPick(zipCodes),
            items: [random.randomPick(items), random.randomPick(items), random.randomPick(items)]
        })
    })
    .then(course => console.log(`${course.title} added to the database.`)) 
    .catch(error => console.log(error.message))
    .then(() => {
        return Course.create({
            title: 'How to recognise nerds',
            description: 'Know your friends better',
            zipCode: random.randomPick(zipCodes),
            items: [random.randomPick(items), random.randomPick(items), random.randomPick(items)]
        })
    })
    .then(course  => console.log(`${course.title} added to the database.`)) 
    .catch(error  => console.log(error.message))
    .then(() => {
        return Subscriber.find({})
            .then(subscriber  => {
                subscriber.forEach( user  => {
                    random_course = random.randomPick(course_titles);
                    Course.findOne({title: random_course})
                        .then(course  => pickedCourse = course )
                        .then(() => {
                            user.courses.push(pickedCourse);
                            user.save();
                            console.log(`User ${user.name} matched with a course:`)
                        })
                        .then(()  => {
                            return Subscriber.populate(user, "courses")
                        })
                        .then(user  => console.log(user) )
                }
                )
            })
            .catch(error  => console.log(error.message))
        }  
            )

