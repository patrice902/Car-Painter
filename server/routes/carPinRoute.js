const express = require("express");
const CarPinController = require("../controllers/carPin.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, CarPinController.getList)
  .post(isAuthenticated, CarPinController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, CarPinController.getListByUserID);

router
  .route("/:id")
  .get(isAuthenticated, CarPinController.getByID)
  .put(isAuthenticated, CarPinController.update)
  .delete(isAuthenticated, CarPinController.delete);

module.exports = router;
