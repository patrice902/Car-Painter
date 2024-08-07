const CarPinService = require("../services/carPinService");
const logger = require("../config/winston");

class CarPinController {
  static async getList(req, res) {
    try {
      let list = await CarPinService.getList();
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
      let list = await CarPinService.getListByUserId(req.params.id);
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
      const carPin = await CarPinService.getById(req.params.id);
      res.json(carPin);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      if (req.user.id !== req.body.userid) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      let carPin = await CarPinService.create(req.body);
      res.json(carPin);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let carPin = await CarPinService.getById(req.params.id);
      if (req.user.id !== carPin.userid) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      carPin = await CarPinService.updateById(req.params.id, req.body);
      res.json(carPin);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      let carPin = await CarPinService.getById(req.params.id);
      if (req.user.id !== carPin.userid) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      await CarPinService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = CarPinController;
