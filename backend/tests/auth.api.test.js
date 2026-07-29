const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("Authentication API", () => {
  it("registers a new user successfully", async () => {
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

  it("rejects duplicate email registration", async () => {
    await User.create({
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Another User",
        email: "duplicate@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("logs in successfully with valid credentials", async () => {
    await User.create({
      name: "Test User",
      email: "login@example.com",
      password: "$2a$10$X2QFwmS8B89yR7AFgFzI8.yk0b1v0e0vRwhE2g4lCYf0eK6ssxkzi",
    });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("rejects invalid password", async () => {
    await User.create({
      name: "Test User",
      email: "badpass@example.com",
      password: "$2a$10$X2QFwmS8B89yR7AFgFzI8.yk0b1v0e0vRwhE2g4lCYf0eK6ssxkzi",
    });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "badpass@example.com", password: "wrongpass" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects invalid JWT", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects expired JWT when present", async () => {
    const expiredToken = jwt.sign(
      { id: "fake-id", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "-1h" },
    );

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
