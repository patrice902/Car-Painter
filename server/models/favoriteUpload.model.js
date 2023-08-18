const bookshelf = require("../config/bookshelf");

/**
 * FavoriteUpload model.
 */

const FavoriteUpload = bookshelf.model("FavoriteUpload", {
  tableName: "favorite_uploads",
  user() {
    return this.belongsTo("User", "user_id");
  },
  upload() {
    return this.belongsTo("Upload", "upload_id");
  },
  dependents: ["user", "upload"],
});

module.exports = FavoriteUpload;
