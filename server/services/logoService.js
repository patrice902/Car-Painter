const Logo = require("../models/logo.model");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");
const config = require("../config");
const { checkSQLWhereInputValid } = require("../utils/common");

class LogoService {
  static async getList() {
    const logos = await Logo.forge().fetchAll();
    return logos;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const logo = await Logo.where({ id }).fetch();
    return logo;
  }

  static async create(payload) {
    const logo = await Logo.forge(payload).save();
    return logo;
  }

  static async updateById(id, payload) {
    const logo = await this.getById(id);
    await logo.save(payload);
    return logo;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Logo.where({ id }).destroy({ require: false });
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
            file.fieldname === "source_file" ? `logos` : `logos/thumbs`;
          const newName =
            file.fieldname === "source_file" ? fileNames[0] : fileNames[1];
          cb(null, `${path}/${newName}`);
        },
      }),
    }).fields([
      { name: "source_file", maxCount: 1 },
      { name: "preview_file", maxCount: 1 },
    ]);
    return filesUploadMulter;
  }
}

module.exports = LogoService;
