exports.up = function (knex) {
  return knex("shared_schemes").update({ accepted: 1 });
};

exports.down = function (knex) {
  return knex("shared_schemes").update({ accepted: 0 });
};
