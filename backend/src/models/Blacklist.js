const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    reason: {
      type: String,
      default: "Marked as suspicious",
    },
    source: {
      type: String,
      default: "Local",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Blacklist", blacklistSchema);
