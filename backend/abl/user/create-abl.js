const path = require("path");
const Ajv = require("ajv").default;
const UserDao = require("../../dao/user-dao");
let dao = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    active: { type: "string" },    
    superadmin: { type: "string" }        
  },
  required: ["firstname", "lastname", "email", "password"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let user = req.body;
      let userCreated = await dao.createUser(user);
      res.json(userCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
