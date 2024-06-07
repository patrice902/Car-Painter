const express = require("express");
const OverlayController = require("../controllers/overlay.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/permissions");

const router = express.Router();

router.route("/").get(isAuthenticated, OverlayController.getList);
// .post(isAuthenticated, OverlayController.create);

router
  .route("/upload-and-create")
  .post(isAuthenticated, isAdmin, OverlayController.uploadAndCreate);

router
  .route("/:id")
  .get(isAuthenticated, OverlayController.getById)
  // .put(isAuthenticated, OverlayController.update)
  .delete(isAuthenticated, isAdmin, OverlayController.delete);

router
  .route("/:id/upload-and-update")
  .put(isAuthenticated, isAdmin, OverlayController.uploadAndUpdate);

module.exports = router;
