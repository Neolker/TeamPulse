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
    active: { type: "string" },    
    superadmin: { type: "string" }   
  },
  required: ["firstname", "lastname", "email"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let data = req.body;
    const valid = ajv.validate(schema, data);
    if (valid) {
      data = await dao.updateUser(data);
      res.json(data);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: firstname, lastname and email are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = UpdateAbl;
