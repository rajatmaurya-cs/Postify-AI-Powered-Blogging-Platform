import { redisClient } from '../Config/redis.js'
import bcrypt from "bcrypt";

import { sendOtpEmail } from "../utils/mailer.js";


export const sendOtpService = async (email, purpose) => {
  if (!purpose) {
    throw new Error("OTP purpose is required");
  }

  const otpKey = `otp:${purpose}:${email}`;
  const cooldownKey = `otpCooldown:${purpose}:${email}`;


  const cooldown = await redisClient.get(cooldownKey);
  if (cooldown) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }


  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  const hashedOTP = await bcrypt.hash(otp, 10);


  await redisClient.set(otpKey, hashedOTP, {
    EX: 300, 
  });


  await redisClient.set(cooldownKey, "true", {
    EX: 60, 
  });


  await sendOtpEmail(email, otp);

  return true;
};
