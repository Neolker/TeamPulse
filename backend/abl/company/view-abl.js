const path = require("path");
const Ajv = require("ajv").default;
const CompanyDao = require("../../dao/company-dao");
let dao = new CompanyDao(path.join(__dirname, "..", "..", "storage", "companies.json"));

let schema = {
  type: "object",
  properties: {  
  	session: { type: "string" }    
  },
  required: ["session"]
};

async function ViewAbl(req, res) {
  try {
  	const ajv = new Ajv();
    const body = req.query.session ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
		  const companies = await dao.viewCompanies();
		  res.json(companies);
		} else {
      res.status(400).send({ "error": "Validation of the input failed: session required." });
    }  
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
