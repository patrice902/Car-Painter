const UploadService = require("../services/uploadService");
const FileService = require("../services/fileService");
const LayerService = require("../services/layerService");
const logger = require("../config/winston");
const config = require("../config");
const SharedUploadService = require("../services/sharedUploadService");

class UploadController {
  static async getList(req, res) {
    try {
      let uploads = await UploadService.getList();
      res.json(uploads);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUserID(req, res) {
    try {
      let uploads = await UploadService.getListByUserID(req.params.id);
      res.json(uploads);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let upload = await UploadService.getById(req.params.id);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let upload = await UploadService.create(req.body);
      upload = await UploadService.getById(upload.id);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadFiles(req, res) {
    try {
      let uploadFiles;
      if (config.bucketURL) {
        uploadFiles = FileService.uploadFilesToS3("upload");
      } else {
        uploadFiles = FileService.uploadFiles("upload");
      }
      uploadFiles(req, res, async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { userID, schemeID, fileNames, newNames } = req.body;
          fileNames = JSON.parse(fileNames);
          newNames = JSON.parse(newNames);
          let uploads = [];
          for (let fileName of fileNames) {
            let uploadItem = await UploadService.create({
              user_id: parseInt(userID),
              scheme_id: parseInt(schemeID),
              file_name: `uploads/${newNames[fileName]}`,
            });
            uploadItem = await UploadService.getById(uploadItem.id);
            uploads.push(uploadItem);
          }
          res.json(uploads);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let upload = await UploadService.updateById(req.params.id, req.body);
      upload = await UploadService.getById(upload.id);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      let { deleteFromAll, userID } = req.body;
      let upload = await UploadService.getById(req.params.id);
      if (deleteFromAll && !userID) {
        await FileService.deleteFileFromS3(upload.file_name);
        await LayerService.deleteByUploadID(req.params.id);
      } else if (userID) {
        let layers = await LayerService.getListByUploadID(req.params.id);
        let schemes = [];
        for (let layer of layers) {
          if (
            !schemes.find((scheme) => scheme.id === layer.scheme.id) &&
            layer.scheme.user_id === userID
          ) {
            schemes.push(layer.scheme);
          }
        }

        await LayerService.deleteByUploadIDAndScheme(
          req.params.id,
          schemes.map((scheme) => scheme.id)
        );
      }
      await UploadService.deleteById(upload.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async deleteLegacyByUserID(req, res) {
    try {
      let { deleteFromAll } = req.body;
      const userID = req.params.id;

      let uploads = await UploadService.getLegacyListByUserID(userID);
      const upload_ids = uploads.map((upload) => upload.id);

      if (deleteFromAll) {
        for (let upload of uploads) {
          let layers = await LayerService.getListByUploadID(upload.id);

          let schemes = [];
          for (let layer of layers) {
            if (!schemes.find((scheme) => scheme.id === layer.scheme.id)) {
              schemes.push(layer.scheme);
            }
          }

          if (schemes.every((scheme) => scheme.user_id === userID)) {
            await FileService.deleteFileFromS3(upload.file_name);
          }

          await LayerService.deleteByUploadIDAndScheme(
            upload.id,
            schemes
              .filter((scheme) => scheme.user_id === userID)
              .map((scheme) => scheme.id)
          );
        }
        // const filePaths = uploads.map((upload) => upload.file_name);
        // FileService.deleteMultiFilesFromS3(filePaths);
        // await LayerService.deleteByMultiUploadIDs(upload_ids);
      }
      await UploadService.deleteByMultiId(upload_ids);

      let sharedUploads = await SharedUploadService.getListByUserId(
        req.params.id
      );
      const legacySharedsUploadIds = sharedUploads
        .filter((item) => item.upload.legacy_mode)
        .map((item) => item.id);
      await SharedUploadService.deleteByMultiId(legacySharedsUploadIds);

      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = UploadController;
