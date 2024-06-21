const Model = require("../config/objection");

/**
 * Logo model.
 */

class Logo extends Model {
  static get tableName() {
    return "builder_logos";
  }
}

module.exports = Logo;
