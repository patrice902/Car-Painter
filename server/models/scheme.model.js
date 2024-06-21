const Model = require("../config/objection");
const path = require("path");

/**
 * Scheme model.
 */

class Scheme extends Model {
  static get tableName() {
    return "builder_schemes";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_schemes.user_id",
          to: "users.id",
        },
      },
      lastModifier: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_schemes.last_modified_by",
          to: "users.id",
        },
      },
      sharedUsers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "sharedScheme.model"),
        join: {
          from: "builder_schemes.id",
          to: "shared_schemes.scheme_id",
        },
      },
      carMake: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "carMake.model"),
        join: {
          from: "builder_schemes.car_make",
          to: "car_makes.id",
        },
      },
      layers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "layer.model"),
        join: {
          from: "builder_schemes.id",
          to: "builder_layers.scheme_id",
        },
      },
      uploads: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "upload.model"),
        join: {
          from: "builder_schemes.id",
          to: "builder_uploads.scheme_id",
        },
      },
      originalAuthor: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "builder_schemes.original_author_id",
          to: "users.id",
        },
      },
      originalScheme: {
        relation: Model.BelongsToOneRelation,
        modelClass: Scheme,
        join: {
          from: "builder_schemes.original_scheme_id",
          to: "builder_schemes.id",
        },
      },
    };
  }
}

module.exports = Scheme;
