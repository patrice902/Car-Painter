const express = require("express");
const SharedUploadController = require("../controllers/sharedUpload.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, SharedUploadController.getList)
  .post(isAuthenticated, SharedUploadController.create);

router
  .route("/:id")
  .get(isAuthenticated, SharedUploadController.getByID)
  .put(isAuthenticated, SharedUploadController.update)
  .delete(isAuthenticated, SharedUploadController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, SharedUploadController.getListByUserID);

router
  .route("/byUpload/:id")
  .get(isAuthenticated, SharedUploadController.getListByUploadID);

module.exports = router;
