const LeagueSeries = require("../models/leagueSeries.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class LeagueSeriesService {
  static async getList() {
    const list = await LeagueSeries.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await LeagueSeries.query((qb) => {
      qb.join("leagues", "league_series.league_id", "=", "leagues.id");
      qb.where("leagues.userid", userid);
    }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const leagueSeries = await LeagueSeries.where({ id }).fetch();
    return leagueSeries;
  }

  static async create(payload) {
    const leagueSeries = await LeagueSeries.forge(payload).save();
    return leagueSeries;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const leagueSeries = await LeagueSeries.where({ id }).fetch();
    await leagueSeries.save(payload);
    return leagueSeries;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await LeagueSeries.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = LeagueSeriesService;
