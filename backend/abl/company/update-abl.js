const path = require("path");
const Ajv = require("ajv").default;
const CompanyDao = require("../../dao/company-dao");
let dao = new CompanyDao(path.join(__dirname, "..", "..", "storage", "companies.json"));

let schema = {
  type: "object",
  properties: {  
  	session: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    owner_id: { type: "string" }    
  },
  required: ["session", "name", "owner_id"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let task = req.body;
    const valid = ajv.validate(schema, task);
    if (valid) {
      task = await dao.updateCompany(task);
      res.json(task);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: name, session and owner_id are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = UpdateAbl;
