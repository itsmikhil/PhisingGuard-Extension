const Blacklist = require("../../../models/Blacklist");

const check = async (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    const blacklistEntry = await Blacklist.findOne({
      domain: hostname,
      active: true,
    });

    if (blacklistEntry) {
      return {
        malicious: true,
        confidence: 100,
        source: "Local Blacklist",
        reasons: ["Domain exists in local blacklist."],
      };
    }

    return {
      malicious: false,
      confidence: 0,
      source: "Local Blacklist",
      reasons: [],
    };
  } catch (err) {
    return {
      malicious: false,
      confidence: 0,
      source: "Local Blacklist",
      reasons: [],
    };
  }
};

module.exports = {
  check,
};
