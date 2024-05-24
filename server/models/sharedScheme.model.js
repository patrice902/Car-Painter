const Model = require("../config/objection");
const path = require("path");

/**
 * SharedScheme model.
 */

class SharedScheme extends Model {
  static get tableName() {
    return "shared_schemes";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "shared_schemes.user_id",
          to: "users.id",
        },
      },
      scheme: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "shared_schemes.scheme_id",
          to: "builder_schemes.id",
        },
      },
    };
  }
}

module.exports = SharedScheme;
