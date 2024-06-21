const SchemeService = require("../services/schemeService");
const logger = require("../config/winston");
const LayerService = require("../services/layerService");

const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "No auth token provided.",
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      message: "You are not authorized to access this resource.",
    });
  }

  next();
};

const isAllowedUser = async (req, res, next) => {
  const userID = req.params.id || req.query.userID;

  if (!req.user) {
    return res.status(401).json({
      message: "No auth token provided.",
    });
  }

  if (!userID || userID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to access this resource.",
    });
  }

  next();
};

const isEditableScheme = async (req, res, next) => {
  const schemeID = req.params.id;

  try {
    const scheme = await SchemeService.getById(schemeID);

    if (!req.user) {
      return res.status(401).json({
        message: "No auth token provided.",
      });
    }

    const editable =
      req.user.id === scheme.user_id ||
      scheme.sharedUsers.find(
        (shared) => shared.user_id === req.user.id && shared.editable
      );

    if (!editable) {
      return res.status(403).json({
        message: "You are not authorized to access this resource.",
      });
    }
  } catch (err) {
    logger.log("error", err.stack);
    return res.status(500).json({
      message: err.message,
    });
  }

  next();
};

const isAllowedLayerAction = async (req, res, next) => {
  try {
    let schemeID;
    if (req.params.id) {
      const layer = await LayerService.getById(req.params.id);
      schemeID = layer.scheme_id;
    } else if (req.body.scheme_id) {
      schemeID = req.body.scheme_id;
    }

    const scheme = await SchemeService.getById(schemeID);

    if (!req.user) {
      return res.status(401).json({
        message: "No auth token provided.",
      });
    }

    const editable =
      req.user.id === scheme.user_id ||
      scheme.sharedUsers.find(
        (shared) => shared.user_id === req.user.id && shared.editable
      );

    if (!editable) {
      return res.status(403).json({
        message: "You are not authorized to access this resource.",
      });
    }
  } catch (err) {
    logger.log("error", err.stack);
    return res.status(500).json({
      message: err.message,
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isAllowedUser,
  isEditableScheme,
  isAllowedLayerAction,
};
