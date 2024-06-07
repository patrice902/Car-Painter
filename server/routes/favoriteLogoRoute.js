const express = require("express");
const FavoriteLogoController = require("../controllers/favoriteLogo.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, FavoriteLogoController.getList)
  .post(isAuthenticated, FavoriteLogoController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, isAllowedUser, FavoriteLogoController.getListByUserID);

// router
//   .route("/byLogo/:id")
//   .get(isAuthenticated, FavoriteLogoController.getListByLogoID);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteLogoController.getById)
  // .put(isAuthenticated, FavoriteLogoController.update)
  .delete(isAuthenticated, FavoriteLogoController.delete);

module.exports = router;
