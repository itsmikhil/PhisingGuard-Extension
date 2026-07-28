const analyzeUrl = async (url) => {
  const normalizedUrl = String(url || "").trim();
  const reasons = [];
  let riskScore = 0;

  const hasProtocol = /^https?:\/\//i.test(normalizedUrl);
  const protocol = normalizedUrl.match(/^([a-z]+):\/\//i);

  if (protocol && protocol[1].toLowerCase() === "http") {
    riskScore += 20;
    reasons.push("URL uses HTTP instead of HTTPS");
  }

  if (hasProtocol) {
    try {
      const parsedUrl = new URL(normalizedUrl);
      const hostname = parsedUrl.hostname;

      const ipPattern = /^\d{1,3}(?:\.\d{1,3}){3}$/;
      if (ipPattern.test(hostname)) {
        riskScore += 30;
        reasons.push("URL uses an IP address instead of a domain");
      }

      const hostnameParts = hostname.split(".").filter(Boolean);
      if (hostnameParts.length > 3) {
        riskScore += 15;
        reasons.push("URL has more than 3 subdomains");
      }

      const lowerUrl = normalizedUrl.toLowerCase();
      if (lowerUrl.includes("@")) {
        riskScore += 25;
        reasons.push("URL contains an '@' character");
      }

      const suspiciousTlds = [".xyz", ".top", ".click", ".gq", ".tk", ".ml"];
      const hasSuspiciousTld = suspiciousTlds.some((tld) =>
        lowerUrl.includes(tld),
      );
      if (hasSuspiciousTld) {
        riskScore += 15;
        reasons.push("URL uses a suspicious TLD");
      }

      const suspiciousKeywords = [
        "login",
        "signin",
        "verify",
        "update",
        "secure",
        "account",
        "bank",
        "paypal",
      ];
      const foundKeywords = suspiciousKeywords.filter((keyword) =>
        lowerUrl.includes(keyword),
      );
      if (foundKeywords.length > 0) {
        riskScore += 10;
        reasons.push("URL contains suspicious keywords");
      }

      const pathLength = normalizedUrl.length;
      if (pathLength > 75) {
        riskScore += 10;
        reasons.push("URL is unusually long");
      }
    } catch (err) {
      // Ignore invalid URL parsing for this heuristic engine
    }
  }

  const clampedScore = Math.min(riskScore, 100);

  let verdict = "SAFE";
  if (clampedScore >= 60) {
    verdict = "DANGEROUS";
  } else if (clampedScore >= 30) {
    verdict = "SUSPICIOUS";
  }

  return {
    riskScore: clampedScore,
    verdict,
    reasons,
  };
};

module.exports = {
  analyzeUrl,
};
