const User = require("../models/User");
const Scan = require("../models/Scan");
const Report = require("../models/Report");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: {
        user,
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

const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Scan.countDocuments({ user: req.user.id });
    const pages = Math.ceil(total / limit) || 1;

    const history = await Scan.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages,
      history,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getStats = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id });

    const totalScans = scans.length;
    const safeCount = scans.filter((scan) => scan.verdict === "SAFE").length;
    const suspiciousCount = scans.filter(
      (scan) => scan.verdict === "SUSPICIOUS",
    ).length;
    const dangerousCount = scans.filter(
      (scan) => scan.verdict === "DANGEROUS",
    ).length;
    const averageRiskScore =
      totalScans > 0
        ? scans.reduce((sum, scan) => sum + scan.riskScore, 0) / totalScans
        : 0;

    const user = await User.findById(req.user.id).select("safetyScore");
    const currentSafetyScore = user ? user.safetyScore : 100;

    return res.status(200).json({
      success: true,
      data: {
        totalScans,
        safeCount,
        suspiciousCount,
        dangerousCount,
        averageRiskScore,
        currentSafetyScore,
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

const createReport = async (req, res) => {
  try {
    const { url, reason } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS URL.",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS URL.",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required.",
      });
    }

    const existingPendingReport = await Report.findOne({
      user: req.user.id,
      url: url.trim(),
      status: "PENDING",
    });

    if (existingPendingReport) {
      return res.status(400).json({
        success: false,
        message: "A pending report for this URL already exists.",
      });
    }

    const report = await Report.create({
      user: req.user.id,
      url: url.trim(),
      reason: reason.trim(),
    });

    return res.status(201).json({
      success: true,
      data: report,
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
  getProfile,
  getHistory,
  getStats,
  createReport,
};
