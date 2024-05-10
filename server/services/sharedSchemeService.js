const SharedScheme = require("../models/sharedScheme.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class SharedSchemeService {
  static async getList() {
    const list = await SharedScheme.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await SharedScheme.where({ user_id }).fetchAll({
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

    const list = await SharedScheme.where({ scheme_id }).fetchAll({
      withRelated: ["user"],
    });
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const shared = await SharedScheme.where({ id }).fetch({
      withRelated: [
        "user",
        "scheme",
        "scheme.carMake",
        "scheme.user",
        "scheme.sharedUsers",
        "scheme.sharedUsers.user",
      ],
    });
    return shared;
  }

  static async create(payload) {
    let shared = await SharedScheme.forge(payload).save();
    shared = shared.toJSON();
    shared = this.getByID(shared.id);
    return shared;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let shared = await SharedScheme.where({ id }).fetch();
    await shared.save(payload);
    shared = this.getByID(id);
    return shared;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await SharedScheme.where({ id }).destroy({ require: false });
    return true;
  }
}

module.exports = SharedSchemeService;
