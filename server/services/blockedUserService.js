const BlockedUserScheme = require("../models/blockedUser.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class BlockedUserSchemeService {
  static async getList() {
    const list = await BlockedUserScheme.forge().fetchAll();
    return list;
  }

  static async getListByBlockerId(blocker_id) {
    if (!checkSQLWhereInputValid(blocker_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await BlockedUserScheme.where({ blocker_id }).fetchAll();
    return list;
  }

  static async getListByBlockedUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await BlockedUserScheme.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const blockRow = await BlockedUserScheme.where({ id }).fetch();
    return blockRow;
  }

  static async create(payload) {
    let blockRow = await BlockedUserScheme.forge(payload).save();
    blockRow = blockRow.toJSON();
    blockRow = this.getByID(blockRow.id);
    return blockRow;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let blockRow = await BlockedUserScheme.where({ id }).fetch();
    await blockRow.save(payload);
    blockRow = this.getByID(id);
    return blockRow;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await BlockedUserScheme.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = BlockedUserSchemeService;
