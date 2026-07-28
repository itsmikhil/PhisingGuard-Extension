const test = require("node:test");
const assert = require("node:assert/strict");

const ThreatDetectionService = require("../src/services/detection/threatDetectionService");

class StubProvider {
  constructor(result) {
    this.result = result;
  }

  async checkUrl() {
    return this.result;
  }
}

test("returns local blacklist hit as phishing", async () => {
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

  const service = new ThreatDetectionService({ localProvider, googleProvider });
  const result = await service.detect("https://bad.example.com");

  assert.equal(result.status, "PHISHING");
  assert.equal(result.provider, "Local Blacklist");
  assert.equal(result.reason, "Domain exists in local blacklist.");
});

test("returns safe browsing hit when local provider is clean", async () => {
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

  const service = new ThreatDetectionService({ localProvider, googleProvider });
  const result = await service.detect("https://suspicious.example.com");

  assert.equal(result.status, "PHISHING");
  assert.equal(result.provider, "Google Safe Browsing");
});

test("returns safe result for benign url", async () => {
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

  const service = new ThreatDetectionService({ localProvider, googleProvider });
  const result = await service.detect("https://safe.example.com");

  assert.equal(result.status, "SAFE");
  assert.equal(result.provider, "None");
  assert.equal(result.confidence, 0);
});

test("returns safe result when provider throws", async () => {
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

  const service = new ThreatDetectionService({ localProvider, googleProvider });
  const result = await service.detect("https://example.com");

  assert.equal(result.status, "SAFE");
  assert.equal(result.provider, "None");
});

test("returns safe result when provider times out", async () => {
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

  const service = new ThreatDetectionService({ localProvider, googleProvider });
  const result = await service.detect("https://timeout.example.com");

  assert.equal(result.status, "SAFE");
  assert.equal(result.provider, "None");
});
