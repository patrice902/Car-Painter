const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");
const config = require("../config");

class FileService {
  // type: "upload", "logo", "overlay", "thumbnail"
  static uploadFiles(type = "upload") {
    let storage = multer.diskStorage({
      destination(req, file, cb) {
        if (type === "upload") cb(null, `./server/assets/uploads/`);
        if (type === "logo") cb(null, `./server/assets/logos/`);
        else cb(null, "./server/assets/scheme_thumbnails/");
      },
      filename(req, file, cb) {
        let { userID } = req.body;
        if (type === "upload" || type === "logo" || type === "overlay")
          cb(null, userID + "_" + file.originalname);
        else cb(null, file.originalname);
      },
    });
    let upload = multer({ storage }).fields([{ name: "files", maxCount: 3 }]);
    return upload;
  }

  // type: "upload", "logo", "overlay", "thumbnail"
  static uploadFilesToS3(type = "upload") {
    let filesUploadMulter = multer({
      storage: multerS3({
        s3,
        bucket: config.bucketURL,
        acl: "public-read",
        contentType(req, file, cb) {
          cb(null, file.mimetype);
        },
        key(req, file, cb) {
          if (type === "upload" || type === "logo" || type === "overlay") {
            let { newNames } = req.body;
            newNames = JSON.parse(newNames);
            cb(null, `${type}s/${newNames[file.originalname]}`);
          } else cb(null, `scheme_thumbnails/${file.originalname}`);
        },
      }),
    }).fields([{ name: "files", maxCount: 3 }]);
    return filesUploadMulter;
  }

  static async cloneFileOnS3(file_path, new_path) {
    await s3
      .copyObject({
        Bucket: config.bucketURL,
        CopySource: config.bucketURL + "/" + file_path,
        Key: new_path,
        ACL: "public-read",
      })
      .promise();
    return true;
  }

  static async deleteFileFromS3(file_path) {
    await s3
      .deleteObject({
        Bucket: config.bucketURL,
        Key: file_path,
      })
      .promise();
    return true;
  }

  static async deleteMultiFilesFromS3(file_paths) {
    const objects = file_paths.map((file_path) => ({ Key: file_path }));
    return s3.deleteObjects({
      Bucket: config.bucketURL,
      Delete: {
        Objects: objects,
      },
    });
  }

  static async deleteMultiFilesFromS3Async(file_paths) {
    const objects = file_paths.map((file_path) => ({ Key: file_path }));
    await s3
      .deleteObjects({
        Bucket: config.bucketURL,
        Delete: {
          Objects: objects,
        },
      })
      .promise();
    return true;
  }
}

module.exports = FileService;
