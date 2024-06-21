const Model = require("../config/objection");

/**
 * Car model.
 */

class Car extends Model {
  static get tableName() {
    return "cars";
  }
}

module.exports = Car;
