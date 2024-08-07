const express = require("express");
const SchemeController = require("../controllers/scheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isEditableScheme } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, SchemeController.getList)
  .post(isAuthenticated, SchemeController.create);

router.route("/public").get(isAuthenticated, SchemeController.getPublicList);

router
  .route("/check-public/:id")
  .get(isAuthenticated, SchemeController.checkIfPublic);

router
  .route("/byUpload/:id")
  .get(isAuthenticated, SchemeController.getListByUploadID);

router.route("/clone/:id").post(isAuthenticated, SchemeController.clone);

router
  .route("/renewCarMakeLayers/:id")
  .post(isAuthenticated, isEditableScheme, SchemeController.renewCarMakeLayers);

router
  .route("/thumbnail")
  .post(isAuthenticated, SchemeController.uploadThumbnail);

router
  .route("/:id")
  .get(isAuthenticated, SchemeController.getById)
  .put(isAuthenticated, isEditableScheme, SchemeController.update)
  .delete(isAuthenticated, isEditableScheme, SchemeController.delete);

module.exports = router;
