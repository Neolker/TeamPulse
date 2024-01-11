const path = require("path");
const Ajv = require("ajv").default;
const CompanyDao = require("../../dao/company-dao");
let dao = new CompanyDao(path.join(__dirname, "..", "..", "storage", "companies.json"));

let schema = {
  type: "object",
  properties: {
    awid: { type: "string" },
    user_id: { type: "string" },
    roles: { type: "array" }    
  },
  required: ["awid", "user_id"]
};

async function AddUserAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let data = req.body;
      let companyUpdated = await dao.addCompanyUser(data);
      res.json(companyUpdated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = AddUserAbl;
