const Upload = require("../models/upload.model");

class UploadService {
  static async getList() {
    const uploads = await Upload.forge().fetchAll({
      withRelated: ["user"],
    });
    return uploads;
  }

  static async getListByUserID(user_id) {
    const uploads = await Upload.where({
      user_id,
    }).fetchAll({
      withRelated: ["user"],
    });
    return uploads;
  }

  static async getLegacyListByUserID(user_id) {
    const uploads = await Upload.where({
      user_id,
      legacy_mode: 1,
    }).fetchAll({
      withRelated: ["user"],
    });
    return uploads;
  }

  static async getById(id) {
    const upload = await Upload.where({ id }).fetch({
      withRelated: ["user"],
    });
    return upload;
  }

  static async create(payload) {
    const upload = await Upload.forge(payload).save();
    return upload;
  }

  static async updateById(id, payload) {
    const upload = await this.getById(id);
    await upload.save(payload);
    return upload;
  }

  static async deleteById(id) {
    await Upload.where({ id }).destroy({ require: false });
    return true;
  }

  static async deleteByMultiId(ids) {
    await Upload.where("id", "IN", ids).destroy({ require: false });
    return true;
  }
}

module.exports = UploadService;
