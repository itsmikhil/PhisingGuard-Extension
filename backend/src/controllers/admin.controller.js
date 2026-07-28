const User = require("../models/User");
const Scan = require("../models/Scan");
const Blacklist = require("../models/Blacklist");

const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalScans,
      totalBlacklistDomains,
      safeScans,
      suspiciousScans,
      dangerousScans,
    ] = await Promise.all([
      User.countDocuments(),
      Scan.countDocuments(),
      Blacklist.countDocuments({ active: true }),
      Scan.countDocuments({ verdict: "SAFE" }),
      Scan.countDocuments({ verdict: "SUSPICIOUS" }),
      Scan.countDocuments({ verdict: "DANGEROUS" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalScans,
        totalBlacklistDomains,
        totalSafeScans: safeScans,
        totalSuspiciousScans: suspiciousScans,
        totalDangerousScans: dangerousScans,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getBlacklist = async (req, res) => {
  try {
    const blacklistEntries = await Blacklist.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: blacklistEntries,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const createBlacklistEntry = async (req, res) => {
  try {
    const { domain, reason, source } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required.",
      });
    }

    const existingEntry = await Blacklist.findOne({
      domain: domain.toLowerCase(),
    });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Domain already exists in blacklist.",
      });
    }

    const newEntry = await Blacklist.create({
      domain: domain.toLowerCase(),
      reason: reason || "Marked as suspicious",
      source: source || "Local",
      active: true,
    });

    return res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateBlacklistEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, source, active } = req.body;

    const updatedEntry = await Blacklist.findByIdAndUpdate(
      id,
      {
        ...(reason !== undefined && { reason }),
        ...(source !== undefined && { source }),
        ...(active !== undefined && { active }),
      },
      { new: true },
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: "Blacklist entry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedEntry,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteBlacklistEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEntry = await Blacklist.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: "Blacklist entry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blacklist entry deleted successfully.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboard,
  getBlacklist,
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
};
