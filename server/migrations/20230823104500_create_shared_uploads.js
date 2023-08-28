exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("shared_uploads", (table) => {
    table.increments("id").primary();
    table
      .integer("upload_id")
      .notNull()
      .index()
      .references("id")
      .inTable("builder_uploads")
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
  return knex.schema.dropTable("shared_uploads");
};
