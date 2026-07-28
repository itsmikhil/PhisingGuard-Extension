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
} = require("../controllers/admin.controller");

router.get("/dashboard", auth, admin, getDashboard);
router.get("/blacklist", auth, admin, getBlacklist);
router.post("/blacklist", auth, admin, createBlacklistEntry);
router.put("/blacklist/:id", auth, admin, updateBlacklistEntry);
router.delete("/blacklist/:id", auth, admin, deleteBlacklistEntry);

module.exports = router;
