const Model = require("../config/objection");
const path = require("path");

/**
 * FavoriteUpload model.
 */

class FavoriteUpload extends Model {
  static get tableName() {
    return "favorite_uploads";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "favorite_uploads.user_id",
          to: "users.id",
        },
      },
      upload: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "upload.model"),
        join: {
          from: "favorite_uploads.upload_id",
          to: "builder_uploads.id",
        },
      },
    };
  }
}

module.exports = FavoriteUpload;
