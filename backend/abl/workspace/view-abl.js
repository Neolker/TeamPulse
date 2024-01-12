const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

async function ViewAbl(req, res) {
  try {
    const ws = await dao.viewWorkspaces();
    res.json(ws);
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
