const express = require("express");
const LayerController = require("../controllers/layer.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedLayerAction } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, LayerController.getList)
  .post(isAuthenticated, isAllowedLayerAction, LayerController.create);

router
  .route("/:id")
  .get(isAuthenticated, LayerController.getById)
  .put(isAuthenticated, isAllowedLayerAction, LayerController.update)
  .delete(isAuthenticated, isAllowedLayerAction, LayerController.delete);

module.exports = router;
