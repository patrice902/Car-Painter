const express = require("express");
const CarPinController = require("../controllers/carPin.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

router
  .route("/")
  // .get(isAuthenticated, CarPinController.getList)
  .post(isAuthenticated, CarPinController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, isAllowedUser, CarPinController.getListByUserID);

router
  .route("/:id")
  .get(isAuthenticated, CarPinController.getById)
  // .put(isAuthenticated, CarPinController.update)
  .delete(isAuthenticated, CarPinController.delete);

module.exports = router;
