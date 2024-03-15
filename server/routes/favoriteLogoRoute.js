const express = require("express");
const FavoriteLogoController = require("../controllers/favoriteLogo.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, FavoriteLogoController.getList)
  .post(isAuthenticated, FavoriteLogoController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, FavoriteLogoController.getListByUserID);

router
  .route("/byLogo/:id")
  .get(isAuthenticated, FavoriteLogoController.getListByLogoID);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteLogoController.getByID)
  .put(isAuthenticated, FavoriteLogoController.update)
  .delete(isAuthenticated, FavoriteLogoController.delete);

module.exports = router;
