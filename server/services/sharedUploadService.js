const SharedUpload = require("../models/sharedUpload.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class SharedUploadService {
  static async getList() {
    const list = await SharedUpload.forge().fetchAll({
      withRelated: ["upload", "upload.user", "user"],
    });
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedUpload.where({ user_id }).fetchAll({
      withRelated: ["upload", "upload.user", "user"],
    });
    return list;
  }

  static async getListByUploadId(upload_id) {
    if (!checkSQLWhereInputValid(upload_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedUpload.where({ upload_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await SharedUpload.where({ id }).fetch({
      withRelated: ["upload", "upload.user", "user"],
    });
    return favorite;
  }

  static async getByInfo(payload) {
    const favorite = await SharedUpload.where(payload).fetch({
      withRelated: ["upload", "upload.user", "user"],
    });
    return favorite;
  }

  static async create(payload) {
    let favorite = await SharedUpload.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let favorite = await SharedUpload.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedUpload.where({ id }).destroy({
      require: false,
    });
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

    await SharedUpload.where("id", "IN", ids).destroy({ require: false });
    return true;
  }
}

module.exports = SharedUploadService;
