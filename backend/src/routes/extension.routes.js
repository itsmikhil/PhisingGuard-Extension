const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const requestLogger = require("../middleware/requestLogger");
const validateRequest = require("../middleware/validateRequest");
const asyncHandler = require("../utils/asyncHandler");
const { rateLimitMiddleware } = require("../middleware/rateLimiter");
const {
  getExtensionConfig,
  getExtensionHealth,
  reportUrl,
  scanUrlForExtension,
} = require("../controllers/extension.controller");

router.get("/health", asyncHandler(getExtensionHealth));
router.get("/config", auth, requestLogger, asyncHandler(getExtensionConfig));
router.post(
  "/report",
  auth,
  requestLogger,
  validateRequest({
    url: { required: true, type: "url" },
    reason: { required: true },
  }),
  asyncHandler(reportUrl),
);
router.post(
  "/scan",
  auth,
  requestLogger,
  rateLimitMiddleware("extension-scan"),
  validateRequest({
    url: { required: true, type: "url" },
  }),
  asyncHandler(scanUrlForExtension),
);

module.exports = router;
