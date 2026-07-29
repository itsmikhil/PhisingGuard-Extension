const { checkThreatIntel } = require("../src/services/detection/threatIntel");
const localProvider = require("../src/services/detection/providers/localBlacklist.provider");
const googleProvider = require("../src/services/detection/providers/googleSafeBrowsing.provider");
const ThreatDetectionService = require("../src/services/detection/threatDetectionService");

jest.mock(
  "../src/services/detection/providers/googleSafeBrowsing.provider",
  () => ({
    checkUrl: jest.fn(),
  }),
);

jest.mock(
  "../src/services/detection/providers/localBlacklist.provider",
  () => ({
    checkUrl: jest.fn(),
  }),
);

describe("Threat Intelligence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a successful provider result", async () => {
    localProvider.checkUrl.mockResolvedValue({
      status: "SAFE",
      provider: "Local Blacklist",
      reason: "",
      confidence: 0,
    });
    googleProvider.checkUrl.mockResolvedValue({
      status: "SAFE",
      provider: "Google Safe Browsing",
      reason: "",
      confidence: 0,
    });

    const result = await checkThreatIntel("https://example.com");
    expect(result.malicious).toBe(false);
  });

  it("handles provider failure gracefully", async () => {
    localProvider.checkUrl.mockRejectedValue(new Error("boom"));
    googleProvider.checkUrl.mockRejectedValue(new Error("boom"));

    const result = await checkThreatIntel("https://example.com");
    expect(result.malicious).toBe(false);
  });

  it("uses local blacklist lookup result", async () => {
    localProvider.checkUrl.mockResolvedValue({
      status: "PHISHING",
      provider: "Local Blacklist",
      reason: "In blacklist",
      confidence: 100,
    });
    googleProvider.checkUrl.mockResolvedValue({
      status: "SAFE",
      provider: "Google Safe Browsing",
      reason: "",
      confidence: 0,
    });

    const result = await checkThreatIntel("https://bad.example.com");
    expect(result.malicious).toBe(true);
    expect(result.source).toBe("Local Blacklist");
  });

  it("combines provider results", async () => {
    const service = new ThreatDetectionService({
      localProvider: {
        checkUrl: async () => ({
          status: "PHISHING",
          provider: "Local Blacklist",
          reason: "Local",
          confidence: 100,
        }),
      },
      googleProvider: {
        checkUrl: async () => ({
          status: "PHISHING",
          provider: "Google Safe Browsing",
          reason: "Google",
          confidence: 100,
        }),
      },
    });

    const result = await service.detect("https://example.com");
    expect(result.status).toBe("PHISHING");
  });
});
