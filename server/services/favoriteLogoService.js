const FavoriteLogo = require("../models/favoriteLogo.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteLogoService {
  static async getList() {
    const list = await FavoriteLogo.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteLogo.where({ user_id }).fetchAll();
    return list;
  }

  static async getListByLogoId(logo_id) {
    if (!checkSQLWhereInputValid(logo_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteLogo.where({ logo_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteLogo.where({ id }).fetch();
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteLogo.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let favorite = await FavoriteLogo.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteLogo.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteLogoService;
