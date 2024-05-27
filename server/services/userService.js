const User = require("../models/user.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class UserService {
  static async getList() {
    const users = await User.query();
    return users;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const user = await User.query()
      .findById(id)
      .withGraphFetched("[blockedUsers, blockedByUsers]");

    return user;
  }

  static async getPremiumById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const user = await User.query().where("id", id).where("pro_user", 1);

    return user;
  }

  static async getByEmail(email) {
    if (!checkSQLWhereInputValid(email)) {
      throw new Error("SQL Injection attack detected.");
    }

    const user = await User.query()
      .where("email", email)
      .withGraphFetched("[blockedUsers, blockedByUsers]");

    return user;
  }

  static async create(payload) {
    const user = await User.query().insert(payload);
    return user;
  }

  static async updateById(id, payload) {
    await User.query().patchAndFetchById(id, payload);
    return await this.getById(id);
  }
}

module.exports = UserService;
