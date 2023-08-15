const bookshelf = require("../config/bookshelf");

/**
 * FavoriteLogo model.
 */

const FavoriteLogo = bookshelf.model("FavoriteLogo", {
  tableName: "favorite_logos",
  user() {
    return this.belongsTo("User", "user_id");
  },
  logo() {
    return this.belongsTo("Logo", "logo_id");
  },
  dependents: ["user", "logo"],
});

module.exports = FavoriteLogo;
