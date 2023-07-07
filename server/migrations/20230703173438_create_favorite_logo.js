exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("favorite_logos", (table) => {
    table.increments("id").primary();
    table
      .integer("logo_id")
      .notNull()
      .index()
      .references("id")
      .inTable("builder_logos")
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
  return knex.schema.dropTable("favorite_logos");
};
