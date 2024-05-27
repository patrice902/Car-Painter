const FavoriteUpload = require("../models/favoriteUpload.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteUploadService {
  static async getList() {
    const list = await FavoriteUpload.query();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteUpload.query().where("user_id", user_id);
    return list;
  }

  static async getListByUploadId(upload_id) {
    if (!checkSQLWhereInputValid(upload_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteUpload.query().where("upload_id", upload_id);
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteUpload.query().findById(id);
    return favorite;
  }

  static async create(payload) {
    const favorite = await FavoriteUpload.query().insert(payload);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteUpload.query().patchAndFetchById(
      id,
      payload
    );
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteUpload.query().deleteById(id);
    return true;
  }
}

module.exports = FavoriteUploadService;
