const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

jest.mock("../src/models/User", () => {
  const { createModelMock } = require("./helpers/mockModelFactory");
  return createModelMock("User");
});

jest.mock("../src/models/Scan", () => {
  const { createModelMock } = require("./helpers/mockModelFactory");
  return createModelMock("Scan");
});

jest.mock("../src/models/Report", () => {
  const { createModelMock } = require("./helpers/mockModelFactory");
  return createModelMock("Report");
});

jest.mock("../src/models/Blacklist", () => {
  const { createModelMock } = require("./helpers/mockModelFactory");
  return createModelMock("Blacklist");
});

jest.mock("../src/models/ScanCache", () => {
  const { createModelMock } = require("./helpers/mockModelFactory");
  return createModelMock("ScanCache");
});

const User = require("../src/models/User");
const Scan = require("../src/models/Scan");
const Report = require("../src/models/Report");
const Blacklist = require("../src/models/Blacklist");
const ScanCache = require("../src/models/ScanCache");

describe("API contract tests", () => {
  beforeEach(() => {
    User.reset();
    Scan.reset();
    Report.reset();
    Blacklist.reset();
    ScanCache.reset();
  });

  it("registers a user and returns a consistent auth response", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("test@example.com");
  });

  it("accepts a valid scan request and returns scan output", async () => {
    const user = await User.create({
      name: "User",
      email: "scan@example.com",
      password: "password123",
    });
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
    );

    const response = await request(app)
      .post("/api/v1/scan")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://example.com" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("verdict");
  });

  it("returns the admin dashboard", async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
    );

    const response = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("submits a report and approves it", async () => {
    const user = await User.create({
      name: "User",
      email: "report@example.com",
      password: "password123",
    });
    const admin = await User.create({
      name: "Admin",
      email: "admin-report@example.com",
      password: "password123",
      role: "admin",
    });
    const userToken = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
    );
    const adminToken = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
    );

    const reportResponse = await request(app)
      .post("/api/v1/user/report")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ url: "https://report.example.com", reason: "Suspicious" });

    expect(reportResponse.status).toBe(201);

    const report = reportResponse.body.data || reportResponse.body;
    const approveResponse = await request(app)
      .put(`/api/v1/admin/reports/${report._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "APPROVED", adminRemark: "approved" });

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.success).toBe(true);
  });
});
