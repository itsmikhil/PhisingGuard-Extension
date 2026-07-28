const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const { scanUrl } = require("../controllers/scan.controller");
const validateRequest = require("../middleware/validateRequest");
const asyncHandler = require("../utils/asyncHandler");
const { rateLimitMiddleware } = require("../middleware/rateLimiter");

router.post(
  "/",
  auth,
  rateLimitMiddleware("scan"),
  validateRequest({
    url: { required: true, type: "url" },
  }),
  asyncHandler(scanUrl),
);

module.exports = router;
