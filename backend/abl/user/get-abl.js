const path = require("path");
const Ajv = require("ajv").default;
const UserDao = require("../../dao/user-dao");
let dao = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    id: { type: "string" },
  },
  required: ["session", "id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const id = body.id;
      const u = await dao.getUser(id);
      if (!u) {
        res.status(400).send({ "error": "User with id " + id + " does not exist." });
      }
      res.json(u);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id and session is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
