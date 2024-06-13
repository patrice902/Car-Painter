const FavoriteScheme = require("../models/favoriteScheme.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FavoriteSchemeService {
  static async getList() {
    const list = await FavoriteScheme.query();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteScheme.query()
      .where("user_id", user_id)
      .withGraphFetched(
        "scheme.[carMake, user(minSelects), sharedUsers.[user(minSelects)]]"
      );
    return list;
  }

  static async getListBySchemeId(scheme_id) {
    if (!checkSQLWhereInputValid(scheme_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await FavoriteScheme.query()
      .where("scheme_id", scheme_id)
      .withGraphFetched("user(minSelects)");
    return list;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const favorite = await FavoriteScheme.query()
      .findById(id)
      .withGraphFetched(
        "[user(minSelects), scheme.[carMake, user(minSelects), sharedUsers.[user(minSelects)]]]"
      );
    return favorite;
  }

  static async create(payload) {
    const favorite = await FavoriteScheme.query().insert(payload);
    return await this.getById(favorite.id);
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteScheme.query().patchAndFetchById(id, payload);

    return await this.getById(id);
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await FavoriteScheme.query().deleteById(id);
    return true;
  }
}

module.exports = FavoriteSchemeService;
