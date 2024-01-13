const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    awid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    owner_id: { type: "string" }    
  },
  required: ["session", "awid", "name", "owner_id"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let workspace = req.body;
      let workspaceCreated = await dao.createWorkspace(workspace);
      res.json(workspaceCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
