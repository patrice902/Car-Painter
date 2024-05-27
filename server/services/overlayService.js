const Overlay = require("../models/overlay.model");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");
const config = require("../config");
const { checkSQLWhereInputValid } = require("../utils/common");

class OverlayService {
  static async getList() {
    const overlays = await Overlay.query();
    return overlays;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const overlay = await Overlay.query().findById(id);
    return overlay;
  }

  static async create(payload) {
    const overlay = await Overlay.query().insert(payload);
    return overlay;
  }

  static async updateById(id, payload) {
    const overlay = await Overlay.query().patchAndFetchById(id, payload);
    return overlay;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Overlay.query().deleteById(id);
    return true;
  }

  static uploadToS3() {
    let filesUploadMulter = multer({
      storage: multerS3({
        s3,
        bucket: config.bucketURL,
        acl: "public-read",
        contentType(req, file, cb) {
          cb(null, file.mimetype);
        },
        key(req, file, cb) {
          let { fileNames } = req.body;
          fileNames = JSON.parse(fileNames);
          const path =
            file.fieldname === "overlay_file" ? `overlays` : `overlays/thumbs`;
          const newName =
            file.fieldname === "overlay_file" ? fileNames[0] : fileNames[1];
          cb(null, `${path}/${newName}`);
        },
      }),
    }).fields([
      { name: "overlay_file", maxCount: 1 },
      { name: "overlay_thumb", maxCount: 1 },
    ]);
    return filesUploadMulter;
  }
}

module.exports = OverlayService;
