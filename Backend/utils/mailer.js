
// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;



// import { Resend } from "resend";

// // ✅ Create the client using your API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendOtpEmail(to, otp) {
//   const result = await resend.emails.send({
//     from: process.env.FROM_EMAIL,   // e.g. onboarding@resend.dev
//     to,
//     subject: "Your OTP Code",
//     html: `
//       <div style="font-family: Arial, sans-serif;">
//         <h2>Your OTP Code</h2>
//         <p>Your OTP is:</p>
//         <h1>${otp}</h1>
//         <p>This code is valid for 5 minutes.</p>
//       </div>
//     `,
//   });

//   console.log("Resend result:", result);
//   return result;
// }



import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false, // 587 => TLS (STARTTLS)
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function sendOtpEmail(to, otp) {

  console.log("Entered in sendOtpEmail mailer.js")
console.log("Sending OTP to:", to);

  const info = await transporter.sendMail({
    from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject: "OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This code is valid for <b>5 minutes</b>.</p>
      </div>
    `,
  });
  console.log("exits form brevo")
  console.log("Brevo messageId:", info.messageId);
  return info;
}
