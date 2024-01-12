const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/workspace/create-abl");
router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

const GetAbl = require("../abl/workspace/get-abl");
router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

const UpdateAbl = require("../abl/workspace/update-abl");
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

const DeleteAbl = require("../abl/workspace/delete-abl");
router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

const ViewAbl = require("../abl/workspace/view-abl");
router.get("/view", async (req, res) => {
  await ViewAbl(req, res);
});

const AddMemberAbl = require("../abl/workspace/add-member-abl");
router.post("/add-member", async (req, res) => {
  await AddMemberAbl(req, res);
});

const DeleteMemberAbl = require("../abl/workspace/delete-member-abl");
router.post("/delete-member", async (req, res) => {
  await DeleteMemberAbl(req, res);
});

module.exports = router;
