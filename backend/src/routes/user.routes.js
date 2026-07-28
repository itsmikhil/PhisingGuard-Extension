const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
    getProfile,
    getHistory,
    getStats
} = require("../controllers/user.controller");

router.get("/profile", auth, getProfile);
router.get("/history", auth, getHistory);
router.get("/stats", auth, getStats);

module.exports = router;
