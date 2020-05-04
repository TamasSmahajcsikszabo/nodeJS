"use strict"

const router = require("express").Router(),
    errorController = ("../controllers/errorController.js");

router.use(errorController.pageNotFoundError)
router.use(errorController.internalServerError)

module.exorts = router;
