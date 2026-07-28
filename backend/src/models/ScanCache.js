const mongoose = require("mongoose");

const scanCacheSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    riskScore: {
      type: Number,
      required: false,
    },
    verdict: {
      type: String,
      enum: ["SAFE", "SUSPICIOUS", "DANGEROUS"],
    },
    reasons: {
      type: [String],
      default: [],
    },
    explanation: {
      title: {
        type: String,
      },
      summary: {
        type: String,
      },
      reasons: {
        type: [String],
        default: [],
      },
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ScanCache", scanCacheSchema);
