
// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;



import { Resend } from "resend";

// ✅ Create the client using your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to, otp) {
  const result = await resend.emails.send({
    from: process.env.FROM_EMAIL,   // e.g. onboarding@resend.dev
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your OTP Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `,
  });

  console.log("Resend result:", result);
  return result;
}

