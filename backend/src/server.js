require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const { validateEnv } = require("./config/env");

validateEnv();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
