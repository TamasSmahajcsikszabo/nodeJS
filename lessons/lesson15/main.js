"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeControllers"),
    errorController = require("./controllers/errorController.js"),
    layouts = require("express-ejs-layouts"),
    mongoose = require("mongoose"),
    // Subscriber = require("./models/subscriber"),
    // Course = require("./models/course");
    dataModels = require("./models/datamodels.js"),
    subscribersController = require("./controllers/subscibersController");

mongoose.connect(
        "mongodb://localhost:27017/recipe_db",
        {useNewUrlParser: true});

mongoose.Promise = global.Promise    

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoSB using Mongoose!")
});
// instantiating new objects
// method one with "new" and "save"
// var subscriber1 = new dataModels.Subscriber({
    // name: "Taylor",
    // email: "taylor@gmail.com"
// })

// subscriber1.save((error, savedDocument) =>{
    // if (error) console.log(error);
    // console.log(savedDocument)
// })

//method2 with "create"
// dataModels.Course.create(
    // {
        // title: "Pixie training",
        // duration: 3,
        // requirement: "free course",
        // supplements: "handout"
    // },
    // function(error, savedDocument) {
        // if (error) console.log(error);
        // console.log(savedDocument)
    // }
// )
// using query methods to find documents
// var findTaylor = dataModels.Subscriber.findOne({name: "Taylor"})
    // .where("email", /taylor/)

// findTaylor.exec((error, data) =>{
    // if (error) console.log(error) 
    // else console.log(data.name)
// });

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

// route declarations
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/courses", homeController.showCourses);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);
app.get("/subscribers", subscribersController.getAllSubscribers, (req, res, next) => {
    res.render("subscribers", 
        {subscribers: req.data})
});

app.use(errorController.pageNotFoundError)
app.use(errorController.internalServerError)
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
