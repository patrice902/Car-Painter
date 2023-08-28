const bookshelf = require("../config/bookshelf");

/**
 * SharedUpload model.
 */

const SharedUpload = bookshelf.model("SharedUpload", {
  tableName: "shared_uploads",
  user() {
    return this.belongsTo("User", "user_id");
  },
  upload() {
    return this.belongsTo("Upload", "upload_id");
  },
  dependents: ["user", "upload"],
});

module.exports = SharedUpload;
