const FavoriteOverlay = require("../models/favoriteOverlay.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteOverlayService {
  static async getList() {
    const list = await FavoriteOverlay.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteOverlay.where({ user_id }).fetchAll();
    return list;
  }

  static async getListByOverlayId(overlay_id) {
    if (!checkSQLWhereInputValid(overlay_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteOverlay.where({ overlay_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteOverlay.where({ id }).fetch();
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteOverlay.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let favorite = await FavoriteOverlay.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteOverlay.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteOverlayService;
