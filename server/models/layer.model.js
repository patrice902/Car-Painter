const Model = require("../config/objection");
const path = require("path");

/**
 * Layer model.
 */

class Layer extends Model {
  static get tableName() {
    return "builder_layers";
  }

  static get relationMappings() {
    return {
      scheme: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "scheme.model"),
        join: {
          from: "builder_layers.scheme_id",
          to: "builder_schemes.id",
        },
      },
    };
  }
}

module.exports = Layer;
