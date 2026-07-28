const isProduction = process.env.NODE_ENV === "production";

const corsConfig = {
  development: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
  ],
  production: [process.env.CLIENT_ORIGIN || ""].filter(Boolean),
};

const allowedOrigins = corsConfig[isProduction ? "production" : "development"];

module.exports = {
  allowedOrigins,
  isProduction,
};
