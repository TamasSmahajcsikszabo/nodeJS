const mongoose = require("mongoose"),
    subscriberController = require("./controllers/subscribersController"),
    homeController = require("./controllers/homeController.js"),
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    router = express.Router(),
    errorControllers = require('./controllers/errorController.js'),
    userController = require('./controllers/usersController'),
    courseController = require('./controllers/coursesController'),
    methodOverride = require("method-override");

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
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

// home
router.get("/", homeController.index)

//courses
router.get("/courses", courseController.index, courseController.indexView)
router.get("/courses/new", courseController.new)
router.post("/courses/create", courseController.create, courseController.redirectView)
router.get("/courses/:id", courseController.show, courseController.showView)
router.get("/courses/:id/edit", courseController.edit)
router.put("/courses/:id/update", courseController.update, courseController.redirectView)
router.delete("/courses/:id/delete", courseController.delete, courseController.redirectView)

//subscribers
router.get("/subscribers", subscriberController.index)
router.get("/contact", subscriberController.new)
router.post("/subscribe", subscriberController.create, subscriberController.redirectView)
router.get("/subscribers/:id", subscriberController.show, subscriberController.showView)
router.get("/subscribers/:id/edit", subscriberController.edit)
router.put("/subscribers/:id/update", subscriberController.update, subscriberController.redirectView)
router.delete("/subscribers/:id/delete", subscriberController.delete, subscriberController.redirectView)

//users
router.get("/users", userController.index, userController.indexView)
router.get("/users/new", userController.new)
router.post("/users/create", userController.create, userController.redirectView)
router.get("/users/:id", userController.show, userController.showView)
router.get("/users/:id/edit", userController.edit)
router.put("/users/:id/update", userController.update, userController.redirectView)
router.delete("/users/:id/delete", userController.delete, userController.redirectView)

router.use(errorControllers.pageNotFoundError)
router.use(errorControllers.internalServerError)

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
