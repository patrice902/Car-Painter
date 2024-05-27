const LeagueSeries = require("../models/leagueSeries.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class LeagueSeriesService {
  static async getList() {
    const list = await LeagueSeries.query();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await LeagueSeries.query()
      .innerJoin("leagues", "league_series.league_id", "leagues.id")
      .where("leagues.userid", userid);

    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const leagueSeries = await LeagueSeries.query().findById(id);
    return leagueSeries;
  }

  static async create(payload) {
    const leagueSeries = await LeagueSeries.query().insert(payload);
    return leagueSeries;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const leagueSeries = await LeagueSeries.query().patchAndFetchById(
      id,
      payload
    );
    return leagueSeries;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await LeagueSeries.query().deleteById(id);
    return true;
  }
}

module.exports = LeagueSeriesService;
