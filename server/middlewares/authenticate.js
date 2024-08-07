const _ = require("lodash");
const UserService = require("../services/userService");

const isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "No auth token provided.",
    });
  }

  const token = JSON.parse(req.headers.authorization);

  if (token && token.usr && token.hash) {
    try {
      const user = await UserService.getMe(token.usr);
      if (user.password === token.hash) {
        req.user = _.omit(user, ["password"]);
        next();
      } else {
        res.status(401).json({
          message: "Invalid token.",
        });
      }
    } catch (_err) {
      console.log("error: ", _err);
      res.status(401).json({
        message: "Invalid token.",
      });
    }
  } else {
    res.status(401).json({
      message: "No auth token provided.",
    });
  }
};

module.exports = {
  isAuthenticated,
};
