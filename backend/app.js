//načtení modulu express
const express = require("express");
const cors = require("cors");

const companyRouter = require("./controller/company-controller");
const workspaceRouter = require("./controller/workspace-controller");
const taskRouter = require("./controller/task-controller");
const userRouter = require("./controller/user-controller");

//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors())

//jednoduchá definice routy s HTTP metodou GET, která pouze navrací text
app.get("/", (req, res) => {
  res.send("Welcome to TeamPulse! Use the documentation for the API calling.");
});

app.use("/company", companyRouter);
app.use("/workspace", workspaceRouter);
app.use("/task", taskRouter);
app.use("/user", userRouter);

app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
