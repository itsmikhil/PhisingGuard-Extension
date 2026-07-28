const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { allowedOrigins } = require("./constants/cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const scanRoutes = require("./routes/scan.routes");
const adminRoutes = require("./routes/admin.routes");
const extensionRoutes = require("./routes/extension.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/scan", scanRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/extension", extensionRoutes);

app.get("/api/v1/health", (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    success: true,
    data: {
      database: "unknown",
      uptime: Number(uptime.toFixed(2)),
      memoryUsage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      },
      nodeVersion: process.version,
      applicationVersion: "1.0.0",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
