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
    methodOverride = require("method-override"),
    expressSession = require("express-session"), //application - client communication
    cookieParser = require("cookie-parser"), // to use cookies to store and decode data back to the server from user browser
    connectFlash = require("connect-flash"); //to create flash messages; it uses a secret passcode to encrypt data in cookies

router.use(cookieParser("secret_passcode")); //cookie pass code to encrypt data
router.use(expressSession({
    secret: "secret_passcode", // secret passcode to encrypt session data
    cookie: {
        maxAge: 4000000
    },
    resave: false, // don't update existing session the server if nothing has changes in the session
    saveUninitialized: false // don't send cookie to the user if no messages are added to the session
}));
router.use(connectFlash());

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

// express will treat the connect-flash messages as local variables on the response
router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
})
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
router.get("/subscribers/new", subscriberController.new)
router.post("/subscribers/create", subscriberController.create, subscriberController.redirectView)
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
