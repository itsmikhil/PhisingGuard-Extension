const extensionConfig = require("../constants/extensionConfig");
const { scanUrl } = require("./scan.controller");
const { createReport } = require("./user.controller");

const getExtensionConfig = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        cacheTTLHours: extensionConfig.cacheTTLHours,
        supportedVersion: extensionConfig.supportedVersion,
        reportEnabled: extensionConfig.reportEnabled,
        scanEnabled: extensionConfig.scanEnabled,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getExtensionHealth = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      status: "online",
      version: extensionConfig.supportedVersion,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const reportUrl = async (req, res) => {
  return createReport(req, res);
};

const scanUrlForExtension = async (req, res) => {
  return scanUrl(req, res);
};

module.exports = {
  getExtensionConfig,
  getExtensionHealth,
  reportUrl,
  scanUrlForExtension,
};
