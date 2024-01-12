const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const id = body.id;
      const ws = await dao.getWorkspace(id);
      if (!ws) {
        res.status(400).send({ "error": "Workspace with id " + id + " does not exist." });
      }
      res.json(ws);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
