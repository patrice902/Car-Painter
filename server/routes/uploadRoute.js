const express = require("express");
const UploadController = require("../controllers/upload.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

// router
//   .route("/")
//   .get(isAuthenticated, UploadController.getList)
//   .post(isAuthenticated, UploadController.create);

router
  .route("/byUserID/:id")
  .get(isAuthenticated, isAllowedUser, UploadController.getListByUserID);

router
  .route("/byUserID/:id/removeLegacy")
  .delete(
    isAuthenticated,
    isAllowedUser,
    UploadController.deleteLegacyByUserID
  );

router
  .route("/uploadFiles")
  .post(isAuthenticated, UploadController.uploadFiles);

router
  .route("/:id")
  .get(isAuthenticated, UploadController.getById)
  // .put(isAuthenticated, UploadController.update)
  .delete(isAuthenticated, UploadController.delete);

module.exports = router;
