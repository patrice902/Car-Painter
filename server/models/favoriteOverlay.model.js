const bookshelf = require("../config/bookshelf");

/**
 * FavoriteOverlay model.
 */

const FavoriteOverlay = bookshelf.model("FavoriteOverlay", {
  tableName: "favorite_overlays",
  user() {
    return this.belongsTo("User", "user_id");
  },
  overlay() {
    return this.belongsTo("Overlay", "overlay_id");
  },
  dependents: ["user", "overlay"],
});

module.exports = FavoriteOverlay;
