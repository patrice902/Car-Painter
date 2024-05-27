const Model = require("../config/objection");
const path = require("path");

/**
 * League model.
 */

class League extends Model {
  static get tableName() {
    return "leagues";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "leagues.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = League;
