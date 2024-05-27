const Model = require("../config/objection");
const path = require("path");

/**
 * LeagueSeries model.
 */

class LeagueSeries extends Model {
  static get tableName() {
    return "league_series";
  }

  static get relationMappings() {
    return {
      league: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "league.model"),
        join: {
          from: "league_series.league_id",
          to: "leagues.id",
        },
      },
    };
  }
}

module.exports = LeagueSeries;
