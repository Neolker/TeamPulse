const path = require("path");
const Ajv = require("ajv").default;
const UserDao = require("../../dao/user-dao");
let dao = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {  
    session: { type: "string" }
  },
  required: ["session"]
};

async function LogoutAbl(req, res) {
  try {
    const ajv = new Ajv();
    let data = req.body;
    const valid = ajv.validate(schema, data);
    if (valid) {
      data = await dao.logoutUser(data);
      res.json(data);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: session is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = LogoutAbl;
