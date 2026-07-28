const generateExplanation = (result) => {
  const { riskScore, verdict, reasons } = result;

  if (verdict === "SAFE") {
    return {
      title: "Safe Website",
      summary: "No significant phishing indicators were detected.",
      reasons,
    };
  }

  if (verdict === "SUSPICIOUS") {
    return {
      title: "Suspicious Website",
      summary: "Some phishing indicators were detected. Proceed carefully.",
      reasons,
    };
  }

  return {
    title: "Dangerous Website",
    summary: "This website is highly likely to be malicious.",
    reasons,
  };
};

module.exports = {
  generateExplanation,
};
