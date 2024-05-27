const BlockedUserScheme = require("../models/blockedUser.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class BlockedUserSchemeService {
  static async getList() {
    const list = await BlockedUserScheme.query();
    return list;
  }

  static async getListByBlockerId(blocker_id) {
    if (!checkSQLWhereInputValid(blocker_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await BlockedUserScheme.query().where(
      "blocker_id",
      blocker_id
    );
    return list;
  }

  static async getListByBlockedUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await BlockedUserScheme.query().where("userid", userid);
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const blockRow = await BlockedUserScheme.query().findById(id);
    return blockRow;
  }

  static async create(payload) {
    const blockRow = await BlockedUserScheme.query().insert(payload);
    return blockRow;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const blockRow = await BlockedUserScheme.query().patchAndFetchById(
      id,
      payload
    );
    return blockRow;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await BlockedUserScheme.query().deleteById(id);
    return true;
  }
}

module.exports = BlockedUserSchemeService;
