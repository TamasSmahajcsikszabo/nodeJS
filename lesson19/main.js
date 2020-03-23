const mongoose = require("mongoose"),
    subscriberController = require("./controllers/subscribersController"),
    homeController = require("./controllers/homeController.js"),
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    router = express.Router(),
    errorControllers = require('./controllers/errorController.js'),
    userController = require('./controllers/usersController'),
    courseController = require('./controllers/coursesController');

mongoose.connect("mongodb://localhost:27017/recipe_db", 
    { useNewUrlParser: true,
      useUnifiedTopology: true
    })

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
app.use("/", router);

// home
router.get("/", homeController.index)

//courses
router.get("/courses", courseController.index, courseController.indexView)
router.get("/courses/new", courseController.new)
router.post("/courses/create", courseController.create, courseController.redirectView)

//subscribers
router.get("/subscribers", subscriberController.index)
router.get("/contact", subscriberController.new)
router.post("/subscribe", subscriberController.create, subscriberController.redirectView)
router.get("/subscribers/:id", subscriberController.show, subscriberController.showView)

//users
router.get("/users", userController.index, userController.indexView)
router.get("/users/new", userController.new)
router.post("/users/create", userController.create, userController.redirectView)
router.get("/users/:id", userController.show, userController.showView)

router.use(errorControllers.pageNotFoundError)
router.use(errorControllers.internalServerError)

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
