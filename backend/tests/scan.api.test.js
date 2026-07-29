const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Scan = require("../src/models/Scan");
const ScanCache = require("../src/models/ScanCache");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

describe("Scan API", () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.create({
      name: "Scan User",
      email: "scan@example.com",
      password: "password123",
    });
    token = createToken(user);
  });

  it("scans a safe URL", async () => {
    const response = await request(app)
      .post("/api/v1/scan")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://example.com" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.verdict).toBeDefined();
  });

  it("scans a suspicious URL", async () => {
    const response = await request(app)
      .post("/api/v1/scan")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://login.example.com" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("rejects an invalid URL", async () => {
    const response = await request(app)
      .post("/api/v1/scan")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "not-a-url" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("returns a cached response when available", async () => {
    await ScanCache.create({
      url: "https://example.com",
      riskScore: 10,
      verdict: "SAFE",
      explanation: { title: "Safe" },
      expiresAt: new Date(Date.now() + 3600000),
    });

    const response = await request(app)
      .post("/api/v1/scan")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://example.com/" });

    expect(response.status).toBe(200);
    expect(response.body.data.riskScore).toBe(10);
  });

  it("rejects unauthorized access", async () => {
    const response = await request(app)
      .post("/api/v1/scan")
      .send({ url: "https://example.com" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
