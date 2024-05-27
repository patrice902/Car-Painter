const Model = require("../config/objection");
const path = require("path");

/**
 * CarPin model.
 */

class CarPin extends Model {
  static get tableName() {
    return "car_pins";
  }

  static get relationMappings() {
    return {
      carMake: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "carMake.model"),
        join: {
          from: "car_pins.car_make",
          to: "car_makes.id",
        },
      },
      User: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "car_pins.userid",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = CarPin;
