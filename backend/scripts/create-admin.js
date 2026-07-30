const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const connectDB = require("../src/config/database");
const { validateEnv } = require("../src/config/env");
const User = require("../src/models/User");

const createAdmin = async () => {
  validateEnv();

  const [nameArg, emailArg, passwordArg] = process.argv.slice(2);
  const name = nameArg || process.env.ADMIN_NAME || "Admin";
  const email = (emailArg || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = passwordArg || process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.log("Usage:");
    console.log("  npm run create:admin -- <name> <email> <password>");
    console.log("Or set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
    process.exit(1);
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.role = "admin";
    existingUser.name = name;
    existingUser.password = await bcrypt.hash(password, 10);
    await existingUser.save();

    console.log(`Admin role updated for ${existingUser.email}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin user created: ${user.email}`);
  await mongoose.disconnect();
};

createAdmin().catch((err) => {
  console.error("Failed to create admin user:", err.message);
  process.exit(1);
});
