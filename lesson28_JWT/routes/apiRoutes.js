const router = require("express").Router(),
    courseController = require("../controllers/coursesController"),
    userController = require("../controllers/usersController.js"),
    subscriberController = require("../controllers/subscribersController.js"),
    User = require("../models/user.js");

// API token-free routes:
// authentication
router.post("/login", userController.apiAuthenticate);
router.post("/token", userController.getApiToken);

// courses
router.get("/courses", courseController.index, courseController.filterUserCourses, courseController.respondJSON);
router.get("/courses/:id/join", courseController.subscribe,  courseController.join, courseController.respondJSON);

//users
router.post("/users/new", userController.validate, userController.create);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// API token needed for these routes
router.use(userController.verifyJWT);

//users
router.get("/users", userController.index, userController.respondJSON);
router.post("/users/new", userController.validate, userController.create);
router.get("/users/:id", userController.show, userController.showView);
router.post("/users/:id/update", userController.update);

//subscribers
router.get("/subscribers", subscriberController.index, subscriberController.respondJSON);

//error handler
router.use(courseController.errorJSON);


module.exports = router;
