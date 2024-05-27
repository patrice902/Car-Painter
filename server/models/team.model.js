const Model = require("../config/objection");
const path = require("path");

/**
 * Team model.
 */

class Team extends Model {
  static get tableName() {
    return "teams";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "teams.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Team;
