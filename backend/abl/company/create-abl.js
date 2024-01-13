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

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let company = req.body;
      let companyCreated = await dao.createCompany(company);
      res.json(companyCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
