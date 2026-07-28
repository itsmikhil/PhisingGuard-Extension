const ScanCache = require("../../models/ScanCache");
const { normalizeUrl } = require("../../utils/urlNormalizer");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const getCachedResult = async (url) => {
  try {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
      return null;
    }

    const now = new Date();
    const cacheEntry = await ScanCache.findOne({
      url: normalizedUrl,
      expiresAt: { $gt: now },
    }).lean();

    if (!cacheEntry) {
      return null;
    }

    return {
      url: cacheEntry.url,
      riskScore: cacheEntry.riskScore,
      verdict: cacheEntry.verdict,
      reasons: cacheEntry.reasons || [],
      explanation: cacheEntry.explanation,
    };
  } catch (error) {
    return null;
  }
};

const saveCachedResult = async (url, result) => {
  try {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
      return null;
    }

    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);

    await ScanCache.findOneAndUpdate(
      { url: normalizedUrl },
      {
        $set: {
          url: normalizedUrl,
          riskScore: result.riskScore,
          verdict: result.verdict,
          reasons: result.reasons || [],
          explanation: result.explanation || null,
          expiresAt,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return true;
  } catch (error) {
    return false;
  }
};

const deleteExpiredCache = async () => {
  try {
    const now = new Date();
    await ScanCache.deleteMany({ expiresAt: { $lte: now } });
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getCachedResult,
  saveCachedResult,
  deleteExpiredCache,
};
