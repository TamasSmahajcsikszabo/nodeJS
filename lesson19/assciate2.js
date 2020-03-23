const random = require("./random"),
    mongoose = require("mongoose"),
    User = require("./models/user"),
    Course = require("./models/course");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/recipe_db", 
    { useNewUrlParser: true });

var pickedCourse, pickedUser;
course_titles = ['Lego basics', 'Boardgame for beginners', 'Board game design', 'Guitar for the untalented', 'How to recognise nerds'],
items = ['sword', 'dice', 'spear', 'dagger', 'guitar pick', 'fake skull', 'electric guitar', 'lab equipemnt', 'tubes', 'bricks', 'meeples', 'board', 'a deck of cards', 'ambient music cd', 'custome'];

var zipCodes = random.randomBetween(1000, 99999, 35);

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
        return User.find({})
            .then(users => {
                users.forEach( user  => {
                    random_course = random.randomPick(course_titles);
                    user.set("courses", [])
                    Course.findOne({title: random_course})
                        .then(course  => pickedCourse = course )
                        .then(() => {
                            user.courses.push(pickedCourse);
                            user.save();
                            console.log(`User ${user.name} matched with a course:`)
                        })
                        .then(()  => {
                            return User.populate(user, "courses")
                        })
                        .then(user  => console.log(user) )
                }
                )
            })
            .catch(error  => console.log(error.message))
        }  
            )
