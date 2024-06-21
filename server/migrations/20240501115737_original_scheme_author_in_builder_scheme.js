exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table
      .integer("original_scheme_id")
      .notNull()
      .index()
      .references("id")
      .inTable("builder_schemes")
      .onDelete("cascade");
    table
      .integer("original_author_id")
      .notNull()
      .index()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("original_scheme_id");
    table.dropColumn("original_author_id");
  });
};
