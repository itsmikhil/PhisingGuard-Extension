const test = require("node:test");
const assert = require("node:assert/strict");

const { normalizeUrl } = require("../src/utils/urlNormalizer");

test("normalizes URLs by lowercasing the host and removing trailing slashes", () => {
  assert.equal(normalizeUrl("https://Example.COM/"), "https://example.com");
  assert.equal(
    normalizeUrl("https://example.com/path/to/page"),
    "https://example.com/path/to/page",
  );
});
