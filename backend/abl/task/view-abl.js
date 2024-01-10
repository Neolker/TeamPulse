const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));

async function ViewAbl(req, res) {
  try {
    const tasks = await dao.viewTasks();
    res.json(tasks);
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
