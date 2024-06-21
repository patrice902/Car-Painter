const express = require("express");
const BlockedUserController = require("../controllers/blockedUser.controller");
const { isAuthenticated } = require("../middlewares/authenticate");
const { isAllowedUser } = require("../middlewares/permissions");

const router = express.Router();

// router
//   .route("/")
//   .get(isAuthenticated, BlockedUserController.getList)
//   .post(isAuthenticated, BlockedUserController.create);

router
  .route("/blocker/:id")
  .get(isAuthenticated, isAllowedUser, BlockedUserController.getListByBlocker);

router
  .route("/blocked/:id")
  .get(
    isAuthenticated,
    isAllowedUser,
    BlockedUserController.getListByBlockedUser
  );

router.route("/:id").get(isAuthenticated, BlockedUserController.getById);
//   .put(isAuthenticated, BlockedUserController.update);

module.exports = router;
