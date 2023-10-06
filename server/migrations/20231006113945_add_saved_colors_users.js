exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("saved_colors", 2000).notNullable().defaultTo("[]");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("saved_colors");
  });
};
