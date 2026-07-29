const ThreatDetectionService = require("../src/services/detection/threatDetectionService");

class StubProvider {
  constructor(result) {
    this.result = result;
  }

  async checkUrl() {
    return this.result;
  }
}

describe("Threat detection service", () => {
  it("returns local blacklist hit as phishing", async () => {
    const localProvider = new StubProvider({
      status: "PHISHING",
      provider: "Local Blacklist",
      reason: "Domain exists in local blacklist.",
      confidence: 100,
    });
    const googleProvider = new StubProvider({
      status: "SAFE",
      provider: "Google Safe Browsing",
      reason: "",
      confidence: 0,
    });

    const service = new ThreatDetectionService({
      localProvider,
      googleProvider,
    });
    const result = await service.detect("https://bad.example.com");

    expect(result.status).toBe("PHISHING");
    expect(result.provider).toBe("Local Blacklist");
    expect(result.reason).toBe("Domain exists in local blacklist.");
  });

  it("returns safe browsing hit when local provider is clean", async () => {
    const localProvider = new StubProvider({
      status: "SAFE",
      provider: "Local Blacklist",
      reason: "",
      confidence: 0,
    });
    const googleProvider = new StubProvider({
      status: "PHISHING",
      provider: "Google Safe Browsing",
      reason: "Reported by Google Safe Browsing.",
      confidence: 100,
    });

    const service = new ThreatDetectionService({
      localProvider,
      googleProvider,
    });
    const result = await service.detect("https://suspicious.example.com");

    expect(result.status).toBe("PHISHING");
    expect(result.provider).toBe("Google Safe Browsing");
  });

  it("returns safe result for benign url", async () => {
    const localProvider = new StubProvider({
      status: "SAFE",
      provider: "Local Blacklist",
      reason: "",
      confidence: 0,
    });
    const googleProvider = new StubProvider({
      status: "SAFE",
      provider: "Google Safe Browsing",
      reason: "",
      confidence: 0,
    });

    const service = new ThreatDetectionService({
      localProvider,
      googleProvider,
    });
    const result = await service.detect("https://safe.example.com");

    expect(result.status).toBe("SAFE");
    expect(result.provider).toBe("None");
    expect(result.confidence).toBe(0);
  });

  it("returns safe result when provider throws", async () => {
    const localProvider = {
      async checkUrl() {
        throw new Error("boom");
      },
    };
    const googleProvider = {
      async checkUrl() {
        throw new Error("boom");
      },
    };

    const service = new ThreatDetectionService({
      localProvider,
      googleProvider,
    });
    const result = await service.detect("https://example.com");

    expect(result.status).toBe("SAFE");
    expect(result.provider).toBe("None");
  });

  it("returns safe result when provider times out", async () => {
    const localProvider = {
      async checkUrl() {
        return {
          status: "SAFE",
          provider: "Local Blacklist",
          reason: "",
          confidence: 0,
        };
      },
    };
    const googleProvider = {
      async checkUrl() {
        throw new Error("Timeout");
      },
    };

    const service = new ThreatDetectionService({
      localProvider,
      googleProvider,
    });
    const result = await service.detect("https://timeout.example.com");

    expect(result.status).toBe("SAFE");
    expect(result.provider).toBe("None");
  });
});
