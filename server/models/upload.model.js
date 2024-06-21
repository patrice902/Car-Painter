const Model = require("../config/objection");
const path = require("path");

/**
 * Upload model.
 */

class Upload extends Model {
  static get tableName() {
    return "builder_uploads";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_uploads.user_id",
          to: "users.id",
        },
      },
      scheme: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "builder_uploads.scheme_id",
          to: "builder_schemes.id",
        },
      },
    };
  }
}

module.exports = Upload;
