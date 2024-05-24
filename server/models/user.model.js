const Model = require("../config/objection");
const path = require("path");

/**
 * User model.
 */

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      schemes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "users.id",
          to: "builder_schemes.user_id",
        },
      },
      sharedSchemes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "sharedScheme.model"),
        join: {
          from: "users.id",
          to: "shared_schemes.user_id",
        },
      },
      bases: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "base.model"),
        join: {
          from: "users.id",
          to: "builder_bases.userid",
        },
      },
      overlays: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "overlay.model"),
        join: {
          from: "users.id",
          to: "builder_overlays.userid",
        },
      },
      uploads: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "upload.model"),
        join: {
          from: "users.id",
          to: "builder_uploads.user_id",
        },
      },
      blockedByUsers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "blockedUser.model"),
        join: {
          from: "users.id",
          to: "blocked_users.userid",
        },
      },
      blockedUsers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "blockedUser.model"),
        join: {
          from: "users.id",
          to: "blocked_users.blocker_id",
        },
      },
    };
  }
}

module.exports = User;
