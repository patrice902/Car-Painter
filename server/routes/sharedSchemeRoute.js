const express = require("express");
const SharedSchemeController = require("../controllers/sharedScheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, SharedSchemeController.getList)
  .post(isAuthenticated, SharedSchemeController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, isAllowedUser, SharedSchemeController.getListByUserID);

router
  .route("/byScheme/:id")
  .get(isAuthenticated, SharedSchemeController.getListBySchemeID);

router
  .route("/:id")
  .get(isAuthenticated, SharedSchemeController.getById)
  .put(isAuthenticated, SharedSchemeController.update)
  .delete(isAuthenticated, SharedSchemeController.delete);

module.exports = router;
