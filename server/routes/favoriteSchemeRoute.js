const express = require("express");
const FavoriteSchemeController = require("../controllers/favoriteScheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, FavoriteSchemeController.getList)
  .post(isAuthenticated, FavoriteSchemeController.create);

router
  .route("/byUser/:id")
  .get(
    isAuthenticated,
    isAllowedUser,
    FavoriteSchemeController.getListByUserID
  );

// router
//   .route("/byScheme/:id")
//   .get(isAuthenticated, FavoriteSchemeController.getListBySchemeID);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteSchemeController.getById)
  // .put(isAuthenticated, FavoriteSchemeController.update)
  .delete(isAuthenticated, FavoriteSchemeController.delete);

module.exports = router;
