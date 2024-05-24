const Team = require("../models/team.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class TeamService {
  static async getList() {
    const list = await Team.query();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await Team.query().where("userid", userid);
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const team = await Team.query().findById(id);
    return team;
  }

  static async create(payload) {
    const team = await Team.query().insert(payload);
    return team;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const team = await Team.query().patchAndFetchById(id, payload);
    return team;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Team.query().deleteById(id);
    return true;
  }
}

module.exports = TeamService;
