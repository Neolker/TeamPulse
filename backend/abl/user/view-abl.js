const path = require("path");
const Ajv = require("ajv").default;
const UserDao = require("../../dao/user-dao");
let dao = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

async function ViewAbl(req, res) {
  try {
    const u = await dao.viewUsers();
    res.json(u);
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
