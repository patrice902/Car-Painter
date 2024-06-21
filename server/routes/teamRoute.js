const express = require("express");
const TeamController = require("../controllers/team.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

// router
//   .route("/")
//   .get(isAuthenticated, TeamController.getList)
//   .post(isAuthenticated, TeamController.create);

router
  .route("/byUser/:id")
  .get(isAuthenticated, isAllowedUser, TeamController.getListByUserID);

router.route("/:id").get(isAuthenticated, TeamController.getById);
//   .put(isAuthenticated, TeamController.update)
//   .delete(isAuthenticated, TeamController.delete);

module.exports = router;
