const Model = require("../config/objection");
const path = require("path");

/**
 * SharedUpload model.
 */

class SharedUpload extends Model {
  static get tableName() {
    return "shared_uploads";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "shared_uploads.user_id",
          to: "users.id",
        },
      },
      upload: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "upload.model"),
        join: {
          from: "shared_uploads.upload_id",
          to: "builder_uploads.id",
        },
      },
    };
  }
}

module.exports = SharedUpload;
