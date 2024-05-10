const Team = require("../models/team.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class TeamService {
  static async getList() {
    const list = await Team.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await Team.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const team = await Team.where({ id }).fetch();
    return team;
  }

  static async create(payload) {
    let team = await Team.forge(payload).save();
    team = team.toJSON();
    team = this.getByID(team.id);
    return team;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let team = await Team.where({ id }).fetch();
    await team.save(payload);
    team = this.getByID(id);
    return team;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Team.where({ id }).destroy({ require: false });
    return true;
  }
}

module.exports = TeamService;
