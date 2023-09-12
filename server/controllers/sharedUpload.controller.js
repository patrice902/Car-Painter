const logger = require("../config/winston");
const CryptoJS = require("crypto-js");
const config = require("../config");
const UploadService = require("../services/uploadService");
const SharedUploadService = require("../services/sharedUploadService");

class SharedUploadController {
  static async getList(req, res) {
    try {
      let list = await SharedUploadService.getList();
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
      let list = await SharedUploadService.getListByUserId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUploadID(req, res) {
    try {
      let list = await SharedUploadService.getListByUploadId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let Shared = await SharedUploadService.getById(req.params.id);
      res.json(Shared);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let Shared = await SharedUploadService.create(req.body);
      res.json(Shared);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async createByCode(req, res) {
    try {
      const { code, userID } = req.body;
      const uploadId = Number(
        CryptoJS.Rabbit.decrypt(code, config.cryptoKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      let upload = (await UploadService.getById(uploadId)).toJSON();

      if (upload.user_id === userID) {
        res.status(400).json({
          message: "You already have that upload item",
        });
        return;
      }

      try {
        let existingSharedUpload = await SharedUploadService.getByInfo({
          upload_id: uploadId,
          user_id: userID,
        });

        if (existingSharedUpload) {
          res.status(400).json({
            message: "You already have that upload item",
          });
          return;
        }
      } catch (err) {
        if (err.message !== "EmptyResponse") {
          logger.log("error", err.stack);
          res.status(500).json({
            message: err.message,
          });
          return;
        }
      }

      let Shared = await SharedUploadService.create({
        upload_id: uploadId,
        user_id: userID,
      });
      res.json(Shared);
    } catch (err) {
      if (err.message === "EmptyResponse") {
        res.status(400).json({
          message: "Invalid Code!",
        });
      } else {
        logger.log("error", err.stack);
        res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async update(req, res) {
    try {
      let Shared = await SharedUploadService.updateById(
        req.params.id,
        req.body
      );
      res.json(Shared);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await SharedUploadService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = SharedUploadController;
