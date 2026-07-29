const { normalizeUrl } = require("../src/utils/urlNormalizer");

describe("Cache URL normalization", () => {
  it("normalizes URLs by lowercasing the host and removing trailing slashes", () => {
    expect(normalizeUrl("https://Example.COM/")).toBe("https://example.com");
    expect(normalizeUrl("https://example.com/path/to/page")).toBe(
      "https://example.com/path/to/page",
    );
  });
});
