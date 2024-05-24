const FavoriteLogo = require("../models/favoriteLogo.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteLogoService {
  static async getList() {
    const list = await FavoriteLogo.query();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteLogo.query().where("user_id", user_id);
    return list;
  }

  static async getListByLogoId(logo_id) {
    if (!checkSQLWhereInputValid(logo_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteLogo.query().where("logo_id", logo_id);
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteLogo.query().findById(id);
    return favorite;
  }

  static async create(payload) {
    const favorite = await FavoriteLogo.query().insert(payload);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteLogo.query().patchAndFetchById(id, payload);
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteLogo.query().deleteById(id);
    return true;
  }
}

module.exports = FavoriteLogoService;
