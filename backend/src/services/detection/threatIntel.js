const localBlacklistProvider = require("./providers/localBlacklist.provider");
const googleSafeBrowsingProvider = require("./providers/googleSafeBrowsing.provider");
const threatProviders = require("../../constants/threatProviders");

const checkThreatIntel = async (url) => {
  try {
    const results = await Promise.all([
      localBlacklistProvider.check(url),
      googleSafeBrowsingProvider.check(url),
    ]);

    const maliciousResults = results.filter((result) => result.malicious);

    if (maliciousResults.length > 0) {
      const highestConfidence = Math.max(...maliciousResults.map((result) => result.confidence));
      const mergedReasons = [...new Set(maliciousResults.flatMap((result) => result.reasons))];
      const mergedSources = [...new Set(maliciousResults.map((result) => result.source))];

      return {
        malicious: true,
        confidence: highestConfidence,
        source: mergedSources.join(", "),
        reasons: mergedReasons,
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
