const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    workspace_id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    solver_id: { type: "string" },
    status: { type: "string" },
    deadline: { type: "string" },  
  },
  required: ["session", "workspace_id", "name", "description", "solver_id", "deadline"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let task = req.body;
    const valid = ajv.validate(schema, task);
    if (valid) {
      task = await dao.updateTask(task);
      res.json(task);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: session, workspace_id, name, description, solver_id and deadline are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = UpdateAbl;
