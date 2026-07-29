const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Blacklist = require("../src/models/Blacklist");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

describe("Admin API", () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    regularUser = await User.create({
      name: "User",
      email: "user@example.com",
      password: "password123",
      role: "user",
    });
    adminToken = createToken(adminUser);
    userToken = createToken(regularUser);
  });

  it("returns the dashboard for admins", async () => {
    const response = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("creates a blacklist entry", async () => {
    const response = await request(app)
      .post("/api/v1/admin/blacklist")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        domain: "malicious.example",
        reason: "malicious",
        source: "test",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("rejects duplicate blacklist entries", async () => {
    await Blacklist.create({
      domain: "duplicate.example",
      reason: "test",
      source: "test",
      active: true,
    });

    const response = await request(app)
      .post("/api/v1/admin/blacklist")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ domain: "duplicate.example", reason: "test", source: "test" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("updates a blacklist entry", async () => {
    const entry = await Blacklist.create({
      domain: "update.example",
      reason: "test",
      source: "test",
      active: true,
    });

    const response = await request(app)
      .put(`/api/v1/admin/blacklist/${entry._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ active: false });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("deletes a blacklist entry", async () => {
    const entry = await Blacklist.create({
      domain: "delete.example",
      reason: "test",
      source: "test",
      active: true,
    });

    const response = await request(app)
      .delete(`/api/v1/admin/blacklist/${entry._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("rejects non-admin access", async () => {
    const response = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
