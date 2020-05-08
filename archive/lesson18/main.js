const mongoose = require("mongoose"),
    subscriberController = require("./controllers/subscribersController"),
    homeController = require("./controllers/homeController.js"),
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    errorControllers = require('./controllers/errorController.js'),
    userController = require('./controllers/usersController'),
    courseController = require('./controllers/coursesController');

mongoose.connect("mongodb://localhost:27017/recipe_db", 
    { useNewUrlParser: true })

mongoose.Promise = global.Promise
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

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/courses", courseController.index, courseController.indexView)
app.get("/subscribers", subscriberController.index)
app.get("/contact", subscriberController.getSubscriptionPage)
app.get("/users", userController.index, userController.indexView)
app.post("/subscribe", subscriberController.saveSubscriber)


app.use(errorControllers.pageNotFoundError)
app.use(errorControllers.internalServerError)

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
