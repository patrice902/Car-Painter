const _ = require("lodash");
const UserService = require("../services/userService");
const logger = require("../config/winston");
const md5 = require("md5");
const configCatClient = require("../utils/configcat");
const { ConfigCatFlags } = require("../constants");
const config = require("../config");

class AuthController {
  static async login(req, res) {
    try {
      const disableAppLogin = await configCatClient.getValueAsync(
        ConfigCatFlags.DISABLE_APP_LOGIN,
        false
      );

      if (disableAppLogin) {
        res.status(400).json({
          message: "Login is disabled",
        });
        return;
      }

      const { usr, password } = req.body;
      if (usr && password) {
        const user = await UserService.getMe(usr);

        if (user.password === md5(md5(password) + config.md5Salt)) {
          res.json({
            user: _.omit(user, ["password"]),
            token: encodeURIComponent(`usr=${user.id}&hash=${user.password}`),
          });
        } else {
          res.status(400).json({
            message: "Invalid Password!",
          });
        }
      } else {
        res.status(400).json({
          message: "Invalid User or Password!",
        });
      }
    } catch (err) {
      logger.log("error", err.stack);
      res.status(400).json({
        message: "Invalid UserID or Password!",
      });
    }
  }

  static async getMe(req, res) {
    res.json(req.user);
  }

  static async signup(req, res) {
    try {
      const disableAppLogin = await configCatClient.getValueAsync(
        ConfigCatFlags.DISABLE_APP_LOGIN,
        false
      );

      if (disableAppLogin) {
        res.status(400).json({
          message: "Signup is disabled",
        });
        return;
      }

      const { id, email, password } = req.body;
      if (id && email && password) {
        let user = await UserService.create({
          id,
          email,
          password: md5(md5(password) + config.md5Salt),
        });

        res.json({
          user: _.omit(user, ["password"]),
          token: encodeURIComponent(`usr=${user.id}&hash=${user.password}`),
        });
      } else {
        res.status(400).json({
          message: "Invalid Request!",
        });
      }
    } catch (err) {
      logger.log("error", err.stack);
      res.status(400).json({
        message: "Invalid UserID or Password!",
      });
    }
  }
}

module.exports = AuthController;
