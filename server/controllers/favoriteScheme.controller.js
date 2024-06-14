const FavoriteSchemeService = require("../services/favoriteSchemeService");
const logger = require("../config/winston");

class FavoriteSchemeController {
  static async getList(req, res) {
    try {
      let list = await FavoriteSchemeService.getList();
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUserID(req, res) {
    try {
      let list = await FavoriteSchemeService.getListByUserId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListBySchemeID(req, res) {
    try {
      let list = await FavoriteSchemeService.getListBySchemeId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      let favorite = await FavoriteSchemeService.getById(req.params.id);
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      if (req.user.id !== req.body.user_id) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      let favorite = await FavoriteSchemeService.create(req.body);
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let favorite = await FavoriteSchemeService.getById(req.params.id);
      if (req.user.id !== favorite.user_id) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      favorite = await FavoriteSchemeService.updateById(
        req.params.id,
        req.body
      );
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      let favorite = await FavoriteSchemeService.getById(req.params.id);
      if (req.user.id !== favorite.user_id) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      await FavoriteSchemeService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = FavoriteSchemeController;
