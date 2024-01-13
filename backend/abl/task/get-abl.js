const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    id: { type: "string" },
  },
  required: ["session", "id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const taskId = body.id;
      const task = await dao.getTask(taskId);
      if (!task) {
        res.status(400).send({ "error": "Task with id " + taskId + " does not exist." });
      }
      res.json(task);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: session and id is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
