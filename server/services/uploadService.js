const Upload = require("../models/upload.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class UploadService {
  static async getList() {
    const uploads = await Upload.query().withGraphFetched("user(minSelects)");
    return uploads;
  }

  static async getListByUserID(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const uploads = await Upload.query()
      .where("user_id", user_id)
      .withGraphFetched("user(minSelects)");

    return uploads;
  }

  static async getLegacyListByUserID(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const uploads = await Upload.query()
      .where("user_id", user_id)
      .where("legacy_mode", 1)
      .withGraphFetched("user(minSelects)");

    return uploads;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const upload = await Upload.query()
      .findById(id)
      .withGraphFetched("user(minSelects)");

    return upload;
  }

  static async create(payload) {
    const upload = await Upload.query().insert(payload);
    return upload;
  }

  static async updateById(id, payload) {
    await Upload.query().patchAndFetchById(id, payload);
    return await this.getById(id);
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Upload.query().deleteById(id);

    return true;
  }

  static async deleteByMultiId(ids) {
    if (!ids || !Array.isArray(ids) || !ids.length) {
      throw new Error("Invalid input.");
    }

    for (let id of ids) {
      if (!checkSQLWhereInputValid(id)) {
        throw new Error("SQL Injection attack detected.");
      }
    }

    await Upload.query().delete().where("id", "IN", ids);

    return true;
  }
}

module.exports = UploadService;
