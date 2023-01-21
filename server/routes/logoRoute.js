const express = require("express");
const LogoController = require("../controllers/logo.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, LogoController.getList)
  .post(isAuthenticated, LogoController.create);

router
  .route("/upload-and-create")
  .post(isAuthenticated, LogoController.uploadAndCreate);

router
  .route("/:id")
  .get(isAuthenticated, LogoController.getByID)
  .put(isAuthenticated, LogoController.update)
  .delete(isAuthenticated, LogoController.delete);

router
  .route("/:id/upload-and-update")
  .put(isAuthenticated, LogoController.uploadAndUpdate);

module.exports = router;
