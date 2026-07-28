const Blacklist = require("../../../models/Blacklist");
const ThreatProvider = require("./threatProvider");

class LocalBlacklistProvider extends ThreatProvider {
  async checkUrl(url) {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();

      const blacklistEntry = await Blacklist.findOne({
        domain: hostname,
        active: true,
      });

      if (blacklistEntry) {
        return {
          status: "PHISHING",
          provider: "Local Blacklist",
          reason: "Domain exists in local blacklist.",
          confidence: 100,
        };
      }

      return {
        status: "SAFE",
        provider: "Local Blacklist",
        reason: "",
        confidence: 0,
      };
    } catch (err) {
      return {
        status: "SAFE",
        provider: "Local Blacklist",
        reason: "",
        confidence: 0,
      };
    }
  }
}

module.exports = new LocalBlacklistProvider();
