const config = require("../config");
const SchemeService = require("../services/schemeService");
const LayerService = require("../services/layerService");
const FileService = require("../services/fileService");
const CarMakeService = require("../services/carMakeService");
const logger = require("../config/winston");
const { checkSQLWhereInputValid } = require("../utils/common");

class SchemeController {
  static async getList(req, res) {
    try {
      const { userID } = req.query;
      let schemes;
      if (userID) {
        schemes = await SchemeService.getListByUserID(userID);
      } else {
        schemes = await SchemeService.getList();
      }
      res.json(schemes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getPublicList(req, res) {
    try {
      const { userID } = req.query;
      let schemes;

      if (userID) {
        schemes = await SchemeService.getPublicListByUserID(userID);
      } else {
        schemes = await SchemeService.getPublicList();
      }

      res.json(schemes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async checkIfPublic(req, res) {
    try {
      let scheme = await SchemeService.getById(req.params.id);

      res.json({
        is_public: scheme.public,
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      let scheme = await SchemeService.getById(req.params.id);

      res.json({
        scheme,
        carMake: scheme.carMake,
        basePaints: scheme.carMake.bases,
        layers: scheme.layers,
        sharedUsers: scheme.sharedUsers,
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const { carMakeID, userID, name, legacy_mode } = req.body;
      if (req.user.id !== userID) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      let carMake = await CarMakeService.getById(carMakeID);

      let legacyMode =
        legacy_mode ||
        !carMake.total_bases ||
        !carMake.builder_layers_2048 ||
        !carMake.builder_layers_2048.length
          ? 1
          : 0;
      let scheme = await SchemeService.create(
        userID,
        carMake.id,
        name,
        legacyMode
      );

      await SchemeService.createCarmakeLayers(
        scheme,
        carMake,
        req.user,
        legacyMode,
        true
      );
      scheme = await SchemeService.getById(scheme.id);
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async renewCarMakeLayers(req, res) {
    try {
      const schemeID = req.params.id;
      let scheme = await SchemeService.getById(schemeID);

      if (!checkSQLWhereInputValid(schemeID)) {
        throw new Error("SQL Injection attack detected.");
      }

      await LayerService.deleteCarLayersInScheme(schemeID);
      await SchemeService.createCarmakeLayers(scheme, scheme.carMake, req.user);
      const schemeUpdatePayload = {
        date_modified: Math.round(new Date().getTime() / 1000),
        last_modified_by: req.user.id,
      };
      await SchemeService.updateById(schemeID, schemeUpdatePayload);
      scheme = await SchemeService.getById(scheme.id);
      global.io.in(schemeID).emit("client-renew-carmake-layers");
      global.io.in("general").emit("client-update-scheme", { data: scheme }); // General Room
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const scheme = await SchemeService.updateById(req.params.id, req.body);
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUploadID(req, res) {
    try {
      let layers = await LayerService.getListByUploadID(req.params.id);
      let schemes = [];
      for (let layer of layers) {
        if (!schemes.find((scheme) => scheme.id === layer.scheme.id)) {
          schemes.push(layer.scheme);
        }
      }
      res.json(schemes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadThumbnail(req, res) {
    try {
      let uploadFiles;
      if (config.bucketURL) {
        uploadFiles = FileService.uploadFilesToS3("thumbnail");
      } else {
        uploadFiles = FileService.uploadFiles("thumbnail");
      }
      uploadFiles(req, res, async function (err) {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { schemeID } = req.body;
          let scheme = await SchemeService.updateById(schemeID, {
            preview_pic: 1,
            thumbnail_updated: 1,
          });
          res.json(scheme);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await LayerService.deleteAllBySchemeId(req.params.id);
      await SchemeService.deleteById(req.params.id);
      await FileService.deleteFileFromS3(
        `scheme_thumbnails/${req.params.id}.jpg`
      );
      global.io.in(req.params.id).emit("client-delete-scheme");
      global.io
        .in("general")
        .emit("client-delete-scheme", { data: { id: req.params.id } }); // General Room
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async clone(req, res) {
    try {
      let scheme = await SchemeService.getById(req.params.id);
      const clonable = req.user.id === scheme.user_id || scheme.public;

      if (!clonable) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      scheme = await SchemeService.cloneById(req.params.id, req.user.id);
      await FileService.cloneFileOnS3(
        `scheme_thumbnails/${req.params.id}.jpg`,
        `scheme_thumbnails/${scheme.id}.jpg`
      );
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = SchemeController;
