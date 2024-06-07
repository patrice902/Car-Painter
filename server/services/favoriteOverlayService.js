const FavoriteOverlay = require("../models/favoriteOverlay.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteOverlayService {
  static async getList() {
    const list = await FavoriteOverlay.query();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteOverlay.query().where("user_id", user_id);
    return list;
  }

  static async getListByOverlayId(overlay_id) {
    if (!checkSQLWhereInputValid(overlay_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteOverlay.query().where("overlay_id", overlay_id);
    return list;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteOverlay.query().findById(id);
    return favorite;
  }

  static async create(payload) {
    const favorite = await FavoriteOverlay.query().insert(payload);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteOverlay.query().patchAndFetchById(
      id,
      payload
    );
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteOverlay.query().deleteById(id);
    return true;
  }
}

module.exports = FavoriteOverlayService;
