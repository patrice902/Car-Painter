exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("public").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("public");
  });
};
