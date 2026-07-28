const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const { scanUrl } = require("../controllers/scan.controller");

router.post("/", auth, scanUrl);

module.exports = router;
