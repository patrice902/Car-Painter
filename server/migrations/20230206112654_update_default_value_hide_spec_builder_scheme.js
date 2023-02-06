exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("hide_spec").defaultTo(true).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("hide_spec").defaultTo(false).alter();
  });
};
