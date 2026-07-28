const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        riskScore: {
            type: Number,
            required: true
        },
        verdict: {
            type: String,
            enum: ["SAFE", "SUSPICIOUS", "DANGEROUS"],
            required: true
        },
        reasons: {
            type: [String],
            default: []
        },
        source: {
            type: String,
            enum: ["extension", "dashboard"],
            default: "extension"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Scan", scanSchema);
