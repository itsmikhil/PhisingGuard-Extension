const Scan = require("../models/Scan");
const { analyzeUrl } = require("../services/detection/ruleEngine");
const { checkThreatIntel } = require("../services/detection/threatIntel");
const {
  calculateFinalScore,
} = require("../services/detection/scoreCalculator");
const {
  generateExplanation,
} = require("../services/detection/explanationGenerator");

const scanUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS URL.",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS URL.",
      });
    }

    const ruleResult = await analyzeUrl(url);
    const threatResult = await checkThreatIntel(url);
    const finalResult = calculateFinalScore(ruleResult, threatResult);
    const explanation = generateExplanation(finalResult);

    const scan = await Scan.create({
      user: req.user.id,
      url,
      riskScore: finalResult.riskScore,
      verdict: finalResult.verdict,
      reasons: finalResult.reasons,
      source: "extension",
    });

    return res.status(200).json({
      success: true,
      data: {
        url: scan.url,
        riskScore: scan.riskScore,
        verdict: scan.verdict,
        explanation,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  scanUrl,
};
