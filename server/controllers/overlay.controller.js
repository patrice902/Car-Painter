const OverlayService = require("../services/overlayService");
const logger = require("../config/winston");

class OverlayController {
  static async getList(req, res) {
    try {
      let overlays = await OverlayService.getList();
      res.json(overlays);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let overlay = await OverlayService.getById(req.params.id);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let overlay = await OverlayService.create(req.body);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let overlay = await OverlayService.updateById(req.params.id, req.body);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadAndCreate(req, res) {
    try {
      let uploadFiles = OverlayService.uploadToS3();
      uploadFiles(req, res, async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { name, fileNames, color, stroke_scale, legacy_mode } = req.body;
          fileNames = JSON.parse(fileNames);
          const logo = await OverlayService.create({
            name,
            color,
            stroke_scale,
            legacy_mode,
            overlay_file: `overlays/${fileNames[0]}`,
            overlay_thumb: `overlays/thumbs/${fileNames[1]}`,
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
      let uploadFiles = OverlayService.uploadToS3();
      uploadFiles(req, res, async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { name, fileNames, color, stroke_scale, legacy_mode } = req.body;
          fileNames = JSON.parse(fileNames);
          const payload = {
            name,
            color,
            stroke_scale,
            legacy_mode,
          };

          if (fileNames[0]) {
            payload.overlay_file = `overlays/${fileNames[0]}`;
          }

          if (fileNames[1]) {
            payload.overlay_thumb = `overlays/thumbs/${fileNames[1]}`;
          }

          let logo = await OverlayService.updateById(req.params.id, payload);
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

module.exports = OverlayController;
