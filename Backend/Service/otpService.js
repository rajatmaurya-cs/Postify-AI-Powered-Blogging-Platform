import { redisClient } from '../Config/redis.js'
import bcrypt from "bcrypt";
import transporter from '../utils/mailer.js';

export const sendOtpService = async (email) => {

    
    const cooldown = await redisClient.get(`otpCooldown:${email}`);

    if (cooldown) {
        throw new Error("Please wait 60 seconds before requesting another OTP");
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

  
    const hashedOTP = await bcrypt.hash(otp, 10);

    
    await redisClient.set(`otp:${email}`, hashedOTP, {
        EX: 300
    });

    
    await redisClient.set(`otpCooldown:${email}`, "true", {
        EX: 60
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        html : `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Secure Verification Code</title>
</head>

<body style="margin:0; background-color:#f3f6fb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- Main Container -->
<table width="560" cellpadding="0" cellspacing="0" 
style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.08); margin:40px 0;">

<!-- HERO IMAGE -->
<tr>
<td>
<img 
src="https://plus.unsplash.com/premium_photo-1681487746049-c39357159f69?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFzc3dvcmR8ZW58MHx8MHx8fDA%3D"
width="560"
style="display:block; width:100%; height:220px; object-fit:cover;"
/>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:48px;">

<!-- Brand -->
<div style="
font-size:30px;
font-weight:800;
color:#2563eb;
letter-spacing:0.5px;
">
Postify
</div>

<!-- Title -->
<div style="
font-size:24px;
font-weight:800;
margin-top:18px;
color:#0f172a;
">
Confirm Your Identity
</div>

<!-- Subtitle -->
<div style="
margin-top:12px;
color:#475569;
font-size:16px;
line-height:1.7;
">
We received a request to verify your email address. Use the One-Time Password (OTP) below to continue.
</div>

<!-- OTP Card -->
<div style="
margin:40px 0;
padding:26px;
text-align:center;
background:linear-gradient(180deg,#f8fbff,#eef2ff);
border-radius:14px;
border:1px solid #e2e8f0;
">

<div style="
font-size:13px;
letter-spacing:2px;
color:#64748b;
font-weight:600;
margin-bottom:10px;
">
YOUR VERIFICATION CODE
</div>

<div style="
font-size:42px;
letter-spacing:12px;
font-weight:900;
color:#2563eb;
">
${otp}
</div>

</div>

<!-- Expiry -->
<div style="
font-size:15px;
color:#334155;
">
⏳ This code expires in <b>5 minutes</b>.
</div>

<!-- Security -->
<div style="
margin-top:14px;
font-size:14px;
color:#64748b;
line-height:1.6;
">
For your protection, never share this code with anyone.
Our security team will never ask for your OTP.
</div>

<!-- Warning Box -->
<div style="
margin-top:28px;
background:#fff7ed;
border:1px solid #fed7aa;
padding:16px;
border-radius:12px;
font-size:13px;
color:#9a3412;
">
If this wasn’t you, please ignore this email. Your account is still secure.
</div>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
padding:26px;
text-align:center;
font-size:12px;
color:#94a3b8;
border-top:1px solid #e2e8f0;
">
© 2026 Pen&Pixel— Security Notification<br>
This is an automated email. Please do not reply.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
    });
};
