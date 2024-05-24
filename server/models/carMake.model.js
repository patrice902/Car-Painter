const Model = require("../config/objection");
const path = require("path");

/**
 * CarMake model.
 */

class CarMake extends Model {
  static get tableName() {
    return "car_makes";
  }

  static get relationMappings() {
    return {
      schemes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "car_makes.id",
          to: "builder_schemes.car_make",
        },
      },
      bases: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "base.model"),
        join: {
          from: "car_makes.id",
          to: "builder_bases.car_make",
        },
      },
    };
  }
}

module.exports = CarMake;
