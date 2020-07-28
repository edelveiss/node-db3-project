const db = require("../db-config.js");
module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
};

function find() {
  return db("schemes");
}

function findById(id) {
  return db("schemes").where({ id }).first();
}

function findSteps(id) {
  return db("steps as st")
    .join("schemes as sc", "sc.id", "st.scheme_id")
    .select(
      "st.id as id",
      "sc.scheme_name as scheme_name",
      "st.step_number as step_number",
      "st.instructions as instructions"
    )
    .where("st.scheme_id", id);
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then((ids) => {
      return findById(ids[0]);
    });
}

function update(id, changes) {
  return db("schemes")
    .where({ id })
    .update(changes)
    .then((count) => (count > 0 ? findById(id) : null));
}

function remove(id) {
  //   let deletedObj = {};
  //   findById(id)
  //     .then((obj) => findSteps(obj.id))
  //     .then((obj) => {
  //       console.log(obj);
  //       deletedObj = { ...obj };
  //     });
  return db("schemes")
    .where("id", id)
    .del()
    .then((delRow) => (delRow > 0 ? id : null));
}
