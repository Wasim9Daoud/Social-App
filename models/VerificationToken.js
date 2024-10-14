const mongoose = require("mongoose");

// category-Schema
const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// category Model
module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
