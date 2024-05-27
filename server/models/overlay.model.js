const Model = require("../config/objection");
const path = require("path");

/**
 * Overlay model.
 */

class Overlay extends Model {
  static get tableName() {
    return "builder_overlays";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_overlays.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Overlay;
