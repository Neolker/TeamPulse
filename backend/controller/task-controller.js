const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/task/create-abl");
router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

const GetAbl = require("../abl/task/get-abl");
router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

const viewAbl = require("../abl/task/view-abl");
router.get("/view", async (req, res) => {
  await viewAbl(req, res);
});

const UpdateAbl = require("../abl/task/update-abl");
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

const DeleteAbl = require("../abl/task/delete-abl");
router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});


module.exports = router;
