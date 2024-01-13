const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

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
		  const ws = await dao.viewWorkspaces();
		  res.json(ws);
		} else {
      res.status(400).send({ "error": "Validation of the input failed: session required." });
    }  
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
