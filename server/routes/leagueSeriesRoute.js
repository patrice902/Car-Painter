const express = require("express");
const LeagueSeriesController = require("../controllers/leagueSeries.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

// router
//   .route("/")
//   .get(isAuthenticated, LeagueSeriesController.getList)
//   .post(isAuthenticated, LeagueSeriesController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, isAllowedUser, LeagueSeriesController.getListByUserID);

router.route("/:id").get(isAuthenticated, LeagueSeriesController.getById);
//   .put(isAuthenticated, LeagueSeriesController.update)
//   .delete(isAuthenticated, LeagueSeriesController.delete);

module.exports = router;
