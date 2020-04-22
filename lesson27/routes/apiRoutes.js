const router = require("express").Router(),
    courseController = require("../controllers/coursesController");

router.get("/courses", courseController.index, courseController.respondJSON);
router.use(courseController.errorJSON);

module.exports = router;
