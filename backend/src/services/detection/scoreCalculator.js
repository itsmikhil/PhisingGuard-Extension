const calculateFinalScore = (ruleResult, threatResult) => {
  if (threatResult && threatResult.malicious) {
    return {
      riskScore: 100,
      verdict: "DANGEROUS",
      reasons: [...(ruleResult.reasons || []), ...threatResult.reasons],
    };
  }

  const finalScore = Math.max(0, Math.min(100, ruleResult.riskScore));

  return {
    riskScore: finalScore,
    verdict: ruleResult.verdict,
    reasons: [...(ruleResult.reasons || [])],
  };
};

module.exports = {
  calculateFinalScore,
};
