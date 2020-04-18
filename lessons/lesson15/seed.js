const mongoose = require("mongoose"),
    datamodels = require("./models/datamodels");

mongoose.connect(
    "mongodb://localhost:27017/recipe_db",
    { useNewUrlParser: true }
)

mongoose.connection;

var contacts = [
     {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 1001
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 2033
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 1910
  }
];


datamodels.Subscriber.deleteMany()
    .exec()
    .then(()  => {
        console.log("Subscriber data is empty")
    });

var commands = [];

contacts.forEach((c)  => {
    commands.push(datamodels.Subscriber.create({
        name: c.name,
        email: c.email
    }))
})

Promise.all(commands)
    .then(r  => {
        console.log(JSON.stringify(r) + '<br>')
        mongoose.connection.close()
    } )
    .catch(error  =>{
        console.log(`ERROR: ${error}`)
    })
