const { analyzeUrl } = require("../src/services/detection/ruleEngine");
const {
  calculateFinalScore,
} = require("../src/services/detection/scoreCalculator");
const {
  generateExplanation,
} = require("../src/services/detection/explanationGenerator");

describe("Rule Engine", () => {
  it("assigns a suspicious score for HTTP URLs", async () => {
    const result = await analyzeUrl("http://example.com");
    expect(result.verdict).toBe("SUSPICIOUS");
    expect(result.riskScore).toBeGreaterThanOrEqual(20);
  });

  it("assigns a dangerous score for suspicious keywords and long URL", async () => {
    const result = await analyzeUrl(
      "https://login.bank-secure-update-account.example.com/this-is-a-very-long-url-that-should-trigger-many-rules",
    );
    expect(result.verdict).toBe("DANGEROUS");
    expect(result.riskScore).toBeGreaterThanOrEqual(60);
  });

  it("returns a safe verdict for benign URLs", async () => {
    const result = await analyzeUrl("https://example.com");
    expect(result.verdict).toBe("SAFE");
    expect(result.riskScore).toBe(0);
  });

  it("calculates the final score from threat intel", () => {
    const finalResult = calculateFinalScore(
      { riskScore: 25, verdict: "SUSPICIOUS", reasons: ["rule"] },
      { malicious: true, reasons: ["threat"] },
    );
    expect(finalResult.riskScore).toBe(100);
    expect(finalResult.verdict).toBe("DANGEROUS");
  });

  it("generates an explanation for a dangerous site", () => {
    const explanation = generateExplanation({
      riskScore: 100,
      verdict: "DANGEROUS",
      reasons: ["phish"],
    });
    expect(explanation.title).toBe("Dangerous Website");
  });
});
