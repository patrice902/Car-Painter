const express = require("express");
const FavoriteOverlayController = require("../controllers/favoriteOverlay.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, FavoriteOverlayController.getList)
  .post(isAuthenticated, FavoriteOverlayController.create);

router
  .route("/byUser/:id")
  .get(
    isAuthenticated,
    isAllowedUser,
    FavoriteOverlayController.getListByUserID
  );

// router
//   .route("/byOverlay/:id")
//   .get(isAuthenticated, FavoriteOverlayController.getListByOverlayID);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteOverlayController.getById)
  // .put(isAuthenticated, FavoriteOverlayController.update)
  .delete(isAuthenticated, FavoriteOverlayController.delete);

module.exports = router;
