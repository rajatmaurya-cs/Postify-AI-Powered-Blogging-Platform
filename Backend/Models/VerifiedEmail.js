import mongoose from "mongoose";

const verifiedEmailSchema = new mongoose.Schema({
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
  purpose: { 
    type: String,
     required: true },
});

const VerifiedEmail = mongoose.model(
  "VerifiedEmail",
  verifiedEmailSchema
);

export default VerifiedEmail;
