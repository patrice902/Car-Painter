const express = require("express");
const UserController = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(isAuthenticated, UserController.getList);

router
  .route("/premium/:id")
  .get(isAuthenticated, UserController.getPremiumByID);

router
  .route("/:id")
  .get(isAuthenticated, UserController.getByID)
  .put(isAuthenticated, UserController.update);

module.exports = router;
