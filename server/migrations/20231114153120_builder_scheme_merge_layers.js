exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("merge_layers").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("merge_layers");
  });
};
