"user strict";
const mongoose = require("mongoose"),
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    router = require("./routes/index.js"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"), 
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("./models/user");



mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/recipe_db", 
    { 
        useNewUrlParser: true,
        useFindAndModify: false
    
    })

// mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
//set API token
// app.set("token", process.env.TOKEN || "recipeT0k3n")

app.use(layouts);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

app.use(express.json());
app.use(cookieParser("secret_passcode")); //cookie pass code to encrypt data
app.use(expressSession({
    secret: "secret_passcode", // secret passcode to encrypt session data
    cookie: {
        maxAge: 4000000
    },
    resave: false, // don't update existing session the server if nothing has changes in the session
    saveUninitialized: false // don't send cookie to the user if no messages are added to the session
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());
// express will treat the connect-flash messages as local variables on the response
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
})

app.use(expressValidator()); //this middleware HAS TO COME after json and urlencoded validations

// routes
app.use("/", router)

server = app.listen(app.get("port"), () => {
        console.log(`Server is running on: ${app.get("port")}`)
    }),
    io = require("socket.io")(server),
    require("./controllers/chatControllers.js")(io); //no need to store this in a constant as won't be used in the main.js
