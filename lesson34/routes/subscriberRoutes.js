const router = require("express").Router(),
    subscriberController = require("../controllers/subscribersController.js");

router.get("/", subscriberController.index)
router.get("/new", subscriberController.new)
router.post("/create", subscriberController.create, subscriberController.redirectView)
router.get("/:id", subscriberController.show, subscriberController.showView)
router.get("/:id/edit", subscriberController.edit)
router.put("/:id/update", subscriberController.update, subscriberController.redirectView)
router.delete("/:id/delete", subscriberController.delete, subscriberController.redirectView)

module.exports = router;
