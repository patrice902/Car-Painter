const Model = require("../config/objection");
const path = require("path");

/**
 * Base model.
 */

class Base extends Model {
  static get tableName() {
    return "builder_bases";
  }

  static get relationMappings() {
    return {
      carMake: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "carMake.model"),
        join: {
          from: "builder_bases.car_make",
          to: "car_makes.id",
        },
      },
      User: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_bases.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Base;
