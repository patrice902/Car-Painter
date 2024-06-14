const express = require("express");
const LogoController = require("../controllers/logo.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/permissions");

const router = express.Router();

router.route("/").get(isAuthenticated, LogoController.getList);
// .post(isAuthenticated, LogoController.create);

router
  .route("/upload-and-create")
  .post(isAuthenticated, isAdmin, LogoController.uploadAndCreate);

router
  .route("/:id")
  .get(isAuthenticated, LogoController.getById)
  // .put(isAuthenticated, LogoController.update)
  .delete(isAuthenticated, isAdmin, LogoController.delete);

router
  .route("/:id/upload-and-update")
  .put(isAuthenticated, isAdmin, LogoController.uploadAndUpdate);

module.exports = router;
