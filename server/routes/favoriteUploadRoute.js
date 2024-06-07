const express = require("express");
const FavoriteUploadController = require("../controllers/favoriteUpload.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, FavoriteUploadController.getList)
  .post(isAuthenticated, FavoriteUploadController.create);

router
  .route("/byUser/:id")
  .get(
    isAuthenticated,
    isAllowedUser,
    FavoriteUploadController.getListByUserID
  );

// router
//   .route("/byUpload/:id")
//   .get(isAuthenticated, FavoriteUploadController.getListByUploadID);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteUploadController.getById)
  // .put(isAuthenticated, FavoriteUploadController.update)
  .delete(isAuthenticated, FavoriteUploadController.delete);

module.exports = router;
