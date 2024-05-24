const Model = require("../config/objection");
const path = require("path");

/**
 * FavoriteLogo model.
 */

class FavoriteLogo extends Model {
  static get tableName() {
    return "favorite_logos";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "favorite_logos.user_id",
          to: "users.id",
        },
      },
      logo: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "logo.model"),
        join: {
          from: "favorite_logos.logo_id",
          to: "builder_logos.id",
        },
      },
    };
  }
}

module.exports = FavoriteLogo;
