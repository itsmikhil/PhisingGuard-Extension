const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const requestLogger = require("../middleware/requestLogger");
const {
  getExtensionConfig,
  getExtensionHealth,
  reportUrl,
  scanUrlForExtension,
} = require("../controllers/extension.controller");

router.get("/health", getExtensionHealth);
router.get("/config", auth, requestLogger, getExtensionConfig);
router.post("/report", auth, requestLogger, reportUrl);
router.post("/scan", auth, requestLogger, scanUrlForExtension);

module.exports = router;
