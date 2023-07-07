exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("favorite_overlays", (table) => {
    table.increments("id").primary();
    table
      .integer("overlay_id")
      .notNull()
      .index()
      .references("id")
      .inTable("builder_overlays")
      .onDelete("cascade");
    table
      .integer("user_id")
      .notNull()
      .index()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("favorite_overlays");
};
