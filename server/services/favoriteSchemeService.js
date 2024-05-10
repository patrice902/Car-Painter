const FavoriteScheme = require("../models/favoriteScheme.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteSchemeService {
  static async getList() {
    const list = await FavoriteScheme.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteScheme.where({ user_id }).fetchAll({
      withRelated: [
        "scheme",
        "scheme.carMake",
        "scheme.user",
        "scheme.sharedUsers",
        "scheme.sharedUsers.user",
      ],
    });
    return list;
  }

  static async getListBySchemeId(scheme_id) {
    if (!checkSQLWhereInputValid(scheme_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteScheme.where({ scheme_id }).fetchAll({
      withRelated: ["user"],
    });
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteScheme.where({ id }).fetch({
      withRelated: [
        "user",
        "scheme",
        "scheme.carMake",
        "scheme.user",
        "scheme.sharedUsers",
        "scheme.sharedUsers.user",
      ],
    });
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteScheme.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let favorite = await FavoriteScheme.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteScheme.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteSchemeService;
