const Base = require("../models/base.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class BasePaintService {
  static async getList() {
    const bases = await Base.query();
    return bases;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const base = await Base.query().findById(id);
    return base;
  }

  static async create(payload) {
    const base = await Base.query().insert(payload);
    return base;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const base = await Base.query().patchAndFetchById(id, payload);
    return base;
  }
}

module.exports = BasePaintService;
