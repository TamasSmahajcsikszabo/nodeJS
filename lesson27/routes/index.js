const router = require("express").Router(),
    homeRoutes = require("./homeRoutes.js"),
    userRoutes = require("./userRoutes.js"),
    courseRoutes = require("./courseRoutes.js"),
    apiRoutes = require("./apiRoutes"),
    subscriberRoutes = require("./subscriberRoutes.js");
    // errorRoutes = require("./errorRoutes.js");

router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
// router.use("/", errorRoutes);

module.exports = router;
