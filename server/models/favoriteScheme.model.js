const Model = require("../config/objection");
const path = require("path");

/**
 * FavoriteScheme model.
 */

class FavoriteScheme extends Model {
  static get tableName() {
    return "favorite_schemes";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "favorite_schemes.user_id",
          to: "users.id",
        },
      },
      scheme: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "favorite_schemes.scheme_id",
          to: "builder_schemes.id",
        },
      },
    };
  }
}

module.exports = FavoriteScheme;
