exports.up = function (knex) {
  return knex("builder_schemes").update({ hide_spec: 1 });
};

exports.down = function (knex) {
  return knex("builder_schemes").update({ hide_spec: 0 });
};
