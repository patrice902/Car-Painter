const SharedScheme = require("../models/sharedScheme.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class SharedSchemeService {
  static async getList() {
    const list = await SharedScheme.query();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedScheme.query()
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

    const list = await SharedScheme.query()
      .where("scheme_id", scheme_id)
      .withGraphFetched("user(minSelects)");
    return list;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const shared = await SharedScheme.query()
      .findById(id)
      .withGraphFetched(
        "[user(minSelects), scheme.[carMake, user(minSelects), sharedUsers.[user(minSelects)]]]"
      );
    return shared;
  }

  static async create(payload) {
    const shared = await SharedScheme.query().insert(payload);
    return await this.getById(shared.id);
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedScheme.query().patchAndFetchById(id, payload);
    return await this.getById(id);
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedScheme.query().deleteById(id);
    return true;
  }
}

module.exports = SharedSchemeService;
