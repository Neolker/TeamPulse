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

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let task = req.body;
      let taskCreated = await dao.createTask(task);
      res.json(taskCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
