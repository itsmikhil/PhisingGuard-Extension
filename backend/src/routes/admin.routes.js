const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  getDashboard,
  getBlacklist,
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
  getReports,
  updateReport,
} = require("../controllers/admin.controller");

router.get("/dashboard", auth, admin, getDashboard);
router.get("/blacklist", auth, admin, getBlacklist);
router.post("/blacklist", auth, admin, createBlacklistEntry);
router.put("/blacklist/:id", auth, admin, updateBlacklistEntry);
router.delete("/blacklist/:id", auth, admin, deleteBlacklistEntry);
router.get("/reports", auth, admin, getReports);
router.put("/reports/:id", auth, admin, updateReport);

module.exports = router;
