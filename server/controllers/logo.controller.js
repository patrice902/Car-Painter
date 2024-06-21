const LogoService = require("../services/logoService");
const logger = require("../config/winston");

class LogoController {
  static async getList(req, res) {
    try {
      let logos = await LogoService.getList();
      res.json(logos);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      let logo = await LogoService.getById(req.params.id);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let logo = await LogoService.create(req.body);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let logo = await LogoService.updateById(req.params.id, req.body);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await LogoService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadAndCreate(req, res) {
    try {
      let uploadFiles = LogoService.uploadToS3();
      uploadFiles(req, res, async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { name, fileNames, type, active, enable_color } = req.body;
          fileNames = JSON.parse(fileNames);
          const logo = await LogoService.create({
            name,
            type,
            active,
            enable_color,
            source_file: `logos/${fileNames[0]}`,
            preview_file: `logos/thumbs/${fileNames[1]}`,
          });
          res.json(logo);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadAndUpdate(req, res) {
    try {
      let uploadFiles = LogoService.uploadToS3();
      uploadFiles(req, res, async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { name, fileNames, type, active, enable_color } = req.body;
          fileNames = JSON.parse(fileNames);
          const payload = {
            name,
            type,
            active,
            enable_color,
          };

          if (fileNames[0]) {
            payload.source_file = `logos/${fileNames[0]}`;
          }

          if (fileNames[1]) {
            payload.preview_file = `logos/thumbs/${fileNames[1]}`;
          }

          let logo = await LogoService.updateById(req.params.id, payload);
          res.json(logo);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = LogoController;
