const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Report = require("../src/models/Report");
const Blacklist = require("../src/models/Blacklist");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

describe("Report workflow", () => {
  let user;
  let adminUser;
  let token;
  let adminToken;

  beforeEach(async () => {
    user = await User.create({
      name: "Reporter",
      email: "reporter@example.com",
      password: "password123",
    });
    adminUser = await User.create({
      name: "Admin",
      email: "reportadmin@example.com",
      password: "password123",
      role: "admin",
    });
    token = createToken(user);
    adminToken = createToken(adminUser);
  });

  it("submits a report", async () => {
    const response = await request(app)
      .post("/api/v1/user/report")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://phish.example.com", reason: "Suspicious site" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("rejects duplicate pending reports", async () => {
    await Report.create({
      user: user._id,
      url: "https://duplicate.example.com",
      reason: "test",
      status: "PENDING",
    });

    const response = await request(app)
      .post("/api/v1/user/report")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://duplicate.example.com", reason: "test" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("approves a report and creates a blacklist entry", async () => {
    const report = await Report.create({
      user: user._id,
      url: "https://approve.example.com",
      reason: "malicious",
    });

    const response = await request(app)
      .put(`/api/v1/admin/reports/${report._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "APPROVED", adminRemark: "Approved" });

    expect(response.status).toBe(200);
    const blacklistEntry = await Blacklist.findOne({
      domain: "approve.example.com",
    });
    expect(blacklistEntry).toBeTruthy();
  });

  it("rejects a report", async () => {
    const report = await Report.create({
      user: user._id,
      url: "https://reject.example.com",
      reason: "malicious",
    });

    const response = await request(app)
      .put(`/api/v1/admin/reports/${report._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "REJECTED", adminRemark: "Rejected" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
