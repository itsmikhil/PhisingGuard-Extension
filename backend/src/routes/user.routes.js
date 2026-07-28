const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  getHistory,
  getStats,
  createReport,
} = require("../controllers/user.controller");

router.get("/profile", auth, getProfile);
router.get("/history", auth, getHistory);
router.get("/stats", auth, getStats);
router.post("/report", auth, createReport);

module.exports = router;
