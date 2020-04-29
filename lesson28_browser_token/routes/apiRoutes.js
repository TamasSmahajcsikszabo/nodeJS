const router = require("express").Router(),
    courseController = require("../controllers/coursesController"),
    userController = require("../controllers/usersController.js"),
    User = require("../models/user.js");

router.use(userController.verifyToken); // to run on every request
// courses
router.get("/courses", courseController.index, courseController.filterUserCourses, courseController.respondJSON);
router.get("/courses/:id/join", courseController.subscribe,  courseController.join, courseController.respondJSON);

//users
router.get("/users", userController.index, userController.respondJSON);
router.post("/users/new", userController.validate, userController.create);
router.get("/users/:id", userController.show, userController.showView);
router.post("/users/:id/update", userController.update);

//error handler
router.use(courseController.errorJSON);


module.exports = router;
