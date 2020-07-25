const db = require("../db-config.js");
module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};

function find() {
  return db("steps");
}

function findById(id) {
  return db("steps").where({ id }).first();
}

function add(step) {
  return db("steps")
    .insert(step)
    .then((ids) => {
      return findById(ids[0]);
    });
}

function update(id, changes) {
  return db("steps")
    .where({ id })
    .update(changes)
    .then((count) => (count > 0 ? findById(id) : null));
}

function remove(id) {
  return db("steps")
    .where("id", id)
    .del()
    .then((delRow) => (delRow > 0 ? id : null));
}
