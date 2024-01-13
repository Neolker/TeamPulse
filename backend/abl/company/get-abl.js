const path = require("path");
const Ajv = require("ajv").default;
const CompanyDao = require("../../dao/company-dao");
let dao = new CompanyDao(path.join(__dirname, "..", "..", "storage", "companies.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    awid: { type: "string" },
  },
  required: ["session", "awid"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.awid ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const companyId = body.awid;
      const company = await dao.getCompany(companyId);
      if (!company) {
        res.status(400).send({ "error": "Company with awid " + companyId + " does not exist." });
      }
      res.json(company);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: awid and session is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
