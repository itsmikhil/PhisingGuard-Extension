const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  getHistory,
  getStats,
  createReport,
} = require("../controllers/user.controller");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.get("/history", auth, getHistory);
router.get("/stats", auth, getStats);
router.post("/report", auth, createReport);

module.exports = router;
