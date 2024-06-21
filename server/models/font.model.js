const Model = require("../config/objection");

/**
 * Font model.
 */

class Font extends Model {
  static get tableName() {
    return "builder_fonts";
  }
}

module.exports = Font;
