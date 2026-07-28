class ThreatDetectionService {
  constructor({ localProvider, googleProvider } = {}) {
    this.localProvider = localProvider;
    this.googleProvider = googleProvider;
  }

  async detect(url) {
    if (!url) {
      return this._buildResult("SAFE", "None", "", 0);
    }

    const providers = [
      { provider: this.localProvider, name: "Local Blacklist" },
      { provider: this.googleProvider, name: "Google Safe Browsing" },
    ];

    for (const entry of providers) {
      if (!entry.provider || typeof entry.provider.checkUrl !== "function") {
        continue;
      }

      try {
        const result = await Promise.race([
          entry.provider.checkUrl(url),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2000),
          ),
        ]);

        if (result && result.status === "PHISHING") {
          return this._normalizeResult(result, entry.name);
        }
      } catch (error) {
        // Ignore provider failures and continue to the next provider.
      }
    }

    return this._buildResult("SAFE", "None", "", 0);
  }

  _normalizeResult(result, fallbackProvider) {
    return this._buildResult(
      result.status || "SAFE",
      result.provider || fallbackProvider || "None",
      result.reason || "",
      typeof result.confidence === "number" ? result.confidence : 0,
    );
  }

  _buildResult(status, provider, reason, confidence) {
    return {
      status,
      provider,
      reason,
      confidence,
    };
  }
}

module.exports = ThreatDetectionService;
