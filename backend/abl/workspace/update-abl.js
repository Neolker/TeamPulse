const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {  
    name: { type: "string" },
    description: { type: "string" },
    owner_id: { type: "string" }    
  },
  required: ["name", "owner_id"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let data = req.body;
    const valid = ajv.validate(schema, data);
    if (valid) {
      data = await dao.updateWorkspace(data);
      res.json(data);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: name and owner_id are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = UpdateAbl;
