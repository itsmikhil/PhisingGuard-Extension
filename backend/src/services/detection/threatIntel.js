const ThreatDetectionService = require("./threatDetectionService");
const localBlacklistProvider = require("./providers/localBlacklist.provider");
const googleSafeBrowsingProvider = require("./providers/googleSafeBrowsing.provider");
const threatProviders = require("../../constants/threatProviders");

const threatDetectionService = new ThreatDetectionService({
  localProvider: localBlacklistProvider,
  googleProvider: googleSafeBrowsingProvider,
});

const checkThreatIntel = async (url) => {
  try {
    const result = await threatDetectionService.detect(url);

    if (result.status === "PHISHING") {
      return {
        malicious: true,
        confidence: result.confidence,
        source: result.provider,
        reasons: result.reason ? [result.reason] : [],
      };
    }

    return {
      malicious: false,
      confidence: 0,
      source: threatProviders.LOCAL_BLACKLIST,
      reasons: [],
    };
  } catch (err) {
    return {
      malicious: false,
      confidence: 0,
      source: threatProviders.LOCAL_BLACKLIST,
      reasons: [],
    };
  }
};

module.exports = {
  checkThreatIntel,
};
