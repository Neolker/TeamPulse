const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const taskId = req.body.id;
      await dao.deleteTask(taskId);
      res.json({"deleted":true});
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = DeleteAbl;
