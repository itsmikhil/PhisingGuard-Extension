const GOOGLE_SAFE_BROWSING_API_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const check = async (url) => {
  try {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

    if (!apiKey) {
      return {
        malicious: false,
        confidence: 0,
        source: "Google Safe Browsing",
        reasons: [],
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

    const response = await fetch(`${GOOGLE_SAFE_BROWSING_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        malicious: false,
        confidence: 0,
        source: "Google Safe Browsing",
        reasons: [],
      };
    }

    const data = await response.json();

    if (data && Array.isArray(data.matches) && data.matches.length > 0) {
      return {
        malicious: true,
        confidence: 100,
        source: "Google Safe Browsing",
        reasons: ["Reported by Google Safe Browsing."],
      };
    }

    return {
      malicious: false,
      confidence: 0,
      source: "Google Safe Browsing",
      reasons: [],
    };
  } catch (err) {
    return {
      malicious: false,
      confidence: 0,
      source: "Google Safe Browsing",
      reasons: [],
    };
  }
};

module.exports = {
  check,
};
