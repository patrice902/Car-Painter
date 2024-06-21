const Model = require("../config/objection");
const path = require("path");

/**
 * FavoriteOverlay model.
 */

class FavoriteOverlay extends Model {
  static get tableName() {
    return "favorite_overlays";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "favorite_overlays.user_id",
          to: "users.id",
        },
      },
      overlay: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "overlay.model"),
        join: {
          from: "favorite_overlays.overlay_id",
          to: "builder_overlays.id",
        },
      },
    };
  }
}

module.exports = FavoriteOverlay;
