const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

jest.mock("../src/models/User", () =>
  require("./helpers/mockModelFactory").createModelMock("User"),
);
jest.mock("../src/models/Scan", () =>
  require("./helpers/mockModelFactory").createModelMock("Scan"),
);
jest.mock("../src/models/Report", () =>
  require("./helpers/mockModelFactory").createModelMock("Report"),
);
jest.mock("../src/models/Blacklist", () =>
  require("./helpers/mockModelFactory").createModelMock("Blacklist"),
);
jest.mock("../src/models/ScanCache", () =>
  require("./helpers/mockModelFactory").createModelMock("ScanCache"),
);

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  process.env.PORT = process.env.PORT || "5001";
  process.env.MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/phishingguard-test";
  process.env.GOOGLE_SAFE_BROWSING_API_KEY =
    process.env.GOOGLE_SAFE_BROWSING_API_KEY || "test-key";
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const models = [
    require("../src/models/User"),
    require("../src/models/Scan"),
    require("../src/models/Report"),
    require("../src/models/Blacklist"),
    require("../src/models/ScanCache"),
  ];

  for (const model of models) {
    if (model && typeof model.reset === "function") {
      model.reset();
    }
  }
});
