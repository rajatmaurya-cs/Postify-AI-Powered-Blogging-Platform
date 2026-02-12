import mongoose from "mongoose";

const verifiedEmailSchema = new mongoose.Schema({
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const VerifiedEmail = mongoose.model(
  "VerifiedEmail",
  verifiedEmailSchema
);

export default VerifiedEmail;
