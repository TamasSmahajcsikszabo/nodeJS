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
    cookieParser = require("cookie-parser"), // uses cookies to store & decode data back to the server from user browser
    connectFlash = require("connect-flash"), //uses a secret passcode to encrypt data in cookies
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("./models/user");



mongoose.connect("mongodb://localhost:27017/recipe_db", 
    { useNewUrlParser: true,
      useUnifiedTopology: true
    })

mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false);
app.use("/", router)
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

router.use(layouts);
router.use(express.static("public"));
router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.use(express.json());
router.use(cookieParser("secret_passcode")); //cookie pass code to encrypt data
router.use(expressSession({
    secret: "secret_passcode", // secret passcode to encrypt session data
    cookie: {
        maxAge: 400
    },
    resave: false, // don't update existing session the server if nothing has changes in the session
    saveUninitialized: false // don't send cookie to the user if no messages are added to the session
}));

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(connectFlash());
// express will treat the connect-flash messages as local variables on the response
router.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    console.log(res.locals.loggedIn)
    res.locals.currentUser = req.user;
    console.log(res.locals.currentUser)
    res.locals.flashMessages = req.flash();
    next();
})

router.use(expressValidator()); //this middleware HAS TO COME after json and urlencoded validations
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
router.post("/users/create", userController.validate, userController.create, userController.redirectView)
router.get("/users/login", userController.login);
router.post("/users/login", userController.authenticate);
router.get("/users/logout", userController.logout, userController.redirectView);
router.get("/users/:id/edit", userController.edit);
router.put("/users/:id/update", userController.update, userController.redirectView)
router.delete("/users/:id/delete", userController.delete, userController.redirectView)
router.get("/users/:id", userController.show, userController.showView)

// error handling
router.use(errorControllers.pageNotFoundError)
router.use(errorControllers.internalServerError)

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
