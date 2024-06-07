const SharedUpload = require("../models/sharedUpload.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class SharedUploadService {
  static async getList() {
    const list = await SharedUpload.query().withGraphFetched(
      "[user, upload.[user]]"
    );
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedUpload.query()
      .where("user_id", user_id)
      .withGraphFetched("[user, upload.[user]]");

    return list;
  }

  static async getListByUploadId(upload_id) {
    if (!checkSQLWhereInputValid(upload_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedUpload.query().where("upload_id", upload_id);
    return list;
  }

  static async getListByUploadIdAndUserID(upload_id, user_id) {
    if (
      !checkSQLWhereInputValid(upload_id) ||
      !checkSQLWhereInputValid(user_id)
    ) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedUpload.query()
      .where("upload_id", upload_id)
      .where("user_id", user_id);

    return list;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const item = await SharedUpload.query()
      .findById(id)
      .withGraphFetched("[user, upload.[user]]");

    return item;
  }

  static async create(payload) {
    const item = await SharedUpload.query().insert(payload);
    return await this.getById(item.id);
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedUpload.query().patchAndFetchById(id, payload);
    return await this.getById(id);
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedUpload.query().deleteById(id);
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

    await SharedUpload.query().delete().where("id", "IN", ids);
    return true;
  }
}

module.exports = SharedUploadService;
