const User = require("../models/User");
const Scan = require("../models/Scan");
const Blacklist = require("../models/Blacklist");
const Report = require("../models/Report");
const { logEvent } = require("../services/auditLogger");

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

    await logEvent("blacklist-created", {
      adminId: req.user.id,
      domain: domain.toLowerCase(),
      source: source || "Local",
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

const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        status,
        adminRemark: adminRemark || "",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { new: true },
    );

    await logEvent("report-reviewed", {
      adminId: req.user.id,
      reportId: report._id,
      status,
    });

    if (status === "APPROVED") {
      const parsedUrl = new URL(report.url);
      const hostname = parsedUrl.hostname.toLowerCase();

      const existingEntry = await Blacklist.findOne({
        domain: hostname,
        active: true,
      });
      if (!existingEntry) {
        await Blacklist.create({
          domain: hostname,
          reason: report.reason,
          source: "User Report",
          active: true,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedReport,
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
  getReports,
  updateReport,
};
