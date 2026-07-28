const ThreatProvider = require("./threatProvider");

const GOOGLE_SAFE_BROWSING_API_URL =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

class GoogleSafeBrowsingProvider extends ThreatProvider {
  async checkUrl(url) {
    try {
      const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

      if (!apiKey) {
        return {
          status: "SAFE",
          provider: "Google Safe Browsing",
          reason: "",
          confidence: 0,
        };
      }

      const requestBody = {
        client: {
          clientId: "phishing-guard-backend",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      };

      const response = await fetch(
        `${GOOGLE_SAFE_BROWSING_API_URL}?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        return {
          status: "SAFE",
          provider: "Google Safe Browsing",
          reason: "",
          confidence: 0,
        };
      }

      const data = await response.json();

      if (data && Array.isArray(data.matches) && data.matches.length > 0) {
        return {
          status: "PHISHING",
          provider: "Google Safe Browsing",
          reason: "Reported by Google Safe Browsing.",
          confidence: 100,
        };
      }

      return {
        status: "SAFE",
        provider: "Google Safe Browsing",
        reason: "",
        confidence: 0,
      };
    } catch (err) {
      return {
        status: "SAFE",
        provider: "Google Safe Browsing",
        reason: "",
        confidence: 0,
      };
    }
  }
}

module.exports = new GoogleSafeBrowsingProvider();
