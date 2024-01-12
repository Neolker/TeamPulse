const path = require("path");
const Ajv = require("ajv").default;
const UserDao = require("../../dao/user-dao");
let dao = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {  
    email: { type: "string" },
    password: { type: "string" }    
  },
  required: ["email", "password"]
};

async function LoginAbl(req, res) {
  try {
    const ajv = new Ajv();
    let data = req.body;
    const valid = ajv.validate(schema, data);
    if (valid) {
      data = await dao.loginUser(data);
      res.json(data);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: email and password are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = LoginAbl;
