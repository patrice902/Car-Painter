const logger = require("../config/winston");
const CryptoJS = require("crypto-js");
const config = require("../config");
const UploadService = require("../services/uploadService");
const SharedUploadService = require("../services/sharedUploadService");
const { checkSQLWhereInputValid } = require("../utils/common");

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

  static async getById(req, res) {
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
    const { code, userID } = req.body;
    let uploadId;

    try {
      uploadId = Number(
        CryptoJS.Rabbit.decrypt(code, config.cryptoKey).toString(
          CryptoJS.enc.Utf8
        )
      );
    } catch (err) {
      return res.status(400).json({
        message: "Invalid Code!",
      });
    }

    if (!uploadId) {
      return res.status(400).json({
        message: "Invalid Code!",
      });
    }

    let upload;
    try {
      upload = await UploadService.getById(uploadId);
    } catch (err) {
      if (err.message === "EmptyResponse") {
        return res.status(400).json({
          message: "Invalid Code!",
        });
      } else {
        logger.log("error", err.stack);
        return res.status(500).json({
          message: err.message,
        });
      }
    }

    if (upload && upload.user_id === userID) {
      return res.status(400).json({
        message: "You already have that upload item",
      });
    }

    try {
      if (!checkSQLWhereInputValid(userID)) {
        throw new Error("SQL Injection attack detected.");
      }

      let existingSharedUpload = await SharedUploadService.getListByUploadIdAndUserID(
        uploadId,
        userID
      );

      if (existingSharedUpload) {
        return res.status(400).json({
          message: "You already have that upload item",
        });
      }
    } catch (err) {
      if (err.message !== "EmptyResponse") {
        logger.log("error", err.stack);
        return res.status(500).json({
          message: "Something went wrong!",
        });
      }
    }

    try {
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
          message: "Error creating shared upload!",
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
