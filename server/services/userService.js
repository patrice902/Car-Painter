const { UserMinimumFields } = require("../constants");
const User = require("../models/user.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class UserService {
  static async getList() {
    const users = await User.query().select(...UserMinimumFields);
    return users;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const user = await User.query()
      .select(...UserMinimumFields)
      .findById(id)
      .withGraphFetched("[blockedUsers, blockedByUsers]");

    return user;
  }

  static async getPremiumById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await User.query()
      .select(...UserMinimumFields)
      .where("id", id)
      .where("pro_user", 1);

    return list.length ? list[0] : null;
  }

  static async getMe(usr) {
    if (!checkSQLWhereInputValid(usr)) {
      throw new Error("SQL Injection attack detected.");
    }
    const isEmail = usr.includes("@");

    const list = await User.query()
      .select(...UserMinimumFields, "password")
      .where(isEmail ? "email" : "id", isEmail ? usr : parseInt(usr))
      .withGraphFetched("[blockedUsers, blockedByUsers]");

    return list.length ? list[0] : null;
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
