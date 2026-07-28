const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const scanRoutes = require("./routes/scan.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running.",
  });
});

module.exports = app;
