const express = require("express");
const router = express.Router();


const CreateAbl = require("../abl/company/create-abl");
router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

const GetAbl = require("../abl/company/get-abl");
router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

const UpdateAbl = require("../abl/company/update-abl");
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

const ViewAbl = require("../abl/company/view-abl");
router.get("/view", async (req, res) => {
  await ViewAbl(req, res);
});

const AddUserAbl = require("../abl/company/add-user-abl");
router.post("/add-user", async (req, res) => {
  await AddUserAbl(req, res);
});

const DeleteUserAbl = require("../abl/company/delete-user-abl");
router.post("/delete-user", async (req, res) => {
  await DeleteUserAbl(req, res);
});


module.exports = router;
