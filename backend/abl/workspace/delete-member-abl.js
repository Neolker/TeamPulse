const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    id: { type: "string" },
    user_id: { type: "string" }    
  },
  required: ["session", "id", "user_id"]
};

async function DeleteMemberAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let data = req.body;
      let ws = await dao.deleteWorkspaceMember(data);
      res.json(ws);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = DeleteMemberAbl;
