const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/user/create-abl");
router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

const GetAbl = require("../abl/user/get-abl");
router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

const ViewAbl = require("../abl/user/view-abl");
router.get("/view", async (req, res) => {
  await ViewAbl(req, res);
});

const UpdateAbl = require("../abl/user/update-abl");
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

const UpdatePasswdAbl = require("../abl/user/update-passwd-abl");
router.post("/passwd", async (req, res) => {
  await UpdatePasswdAbl(req, res);
});

const loginAbl = require("../abl/user/login-abl");
router.post("/login", async (req, res) => {
  await loginAbl(req, res);
});

const logoutAbl = require("../abl/user/logout-abl");
router.post("/logout", async (req, res) => {
  await logoutAbl(req, res);
});


module.exports = router;
