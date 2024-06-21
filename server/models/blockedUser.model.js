const Model = require("../config/objection");
const path = require("path");

/**
 * BlockedUser model.
 */

class BlockedUser extends Model {
  static get tableName() {
    return "blocked_users";
  }

  static get relationMappings() {
    return {
      blockerUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "blocked_users.blocker_id",
          to: "users.id",
        },
      },
      blockedUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "blocked_users.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = BlockedUser;
