import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false, 
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

// export async function sendOtpEmail(to, otp) {

 
//   const info = await transporter.sendMail({
//     from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
//     to,
//     subject: "OTP Verification",
//     html: `
//       <div style="font-family: Arial, sans-serif;">
//         <h2>OTP Verification</h2>
//         <p>Your OTP is:</p>
//         <h1 style="letter-spacing: 6px;">${otp}</h1>
//         <p>This code is valid for <b>5 minutes</b>.</p>
//       </div>
//     `,
//   });
 
//   return info;
// }


export async function sendOtpEmail(to, otp) {

 
  const info = await transporter.sendMail({
    from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject: "OTP Verification",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>OTP Verification – Postify</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* ── Reset ── */
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #f0f2f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }

    /* ── Responsive ── */
    @media only screen and (max-width: 620px) {
      .email-wrapper { padding: 20px 10px !important; }
      .email-card { border-radius: 12px !important; }

      /* Header */
      .header-cell { padding: 24px 20px 18px 20px !important; }
      .brand-name { font-size: 22px !important; }
      .tagline { font-size: 11px !important; letter-spacing: 1px !important; }

      /* Banner image */
      .banner-img-wrap { padding: 0 12px 0 12px !important; }
      .banner-img {
        border-radius: 10px !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Body */
      .body-cell { padding: 28px 20px 24px 20px !important; }
      .otp-title { font-size: 21px !important; }
      .otp-subtitle { font-size: 14px !important; }
      .otp-box { padding: 20px 24px !important; }
      .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
      .otp-label { font-size: 10px !important; }

      /* Footer */
      .footer-cell { padding: 20px 20px !important; }
      .footer-links { font-size: 12px !important; }
      .footer-copy { font-size: 11px !important; }
    }

    @media only screen and (max-width: 400px) {
      .otp-code { font-size: 26px !important; letter-spacing: 6px !important; }
      .otp-box { padding: 16px 14px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;">

  <!-- Outer wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f2f5;min-width:100%;">
    <tr>
      <td align="center" class="email-wrapper" style="padding:40px 16px;">

        <!-- 600px card container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
          class="email-card"
          style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;background-color:#ffffff;box-shadow:0 4px 32px rgba(0,0,0,0.09);">

          <!-- ─── HEADER ─── -->
          <tr>
            <td class="header-cell" align="center" style="background-color:#ffffff;padding:32px 40px 24px 40px;">

              <!-- Logo row: icon + wordmark side by side -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  
                  <!-- Brand name -->
                  <td valign="middle">
                    <span class="brand-name" style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:700;color:#4F46E5;letter-spacing:0.4px;">Postify</span>
                  </td>
                </tr>
              </table>

              <!-- Tagline pill -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                <tr>
                  <td align="center" style="background-color:#eef2ff;border-radius:20px;padding:5px 14px;">
                    <span class="tagline" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;color:#6366F1;letter-spacing:1.5px;text-transform:uppercase;">AI-Powered Blogging Platform</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ─── BANNER IMAGE (padded + rounded corners) ─── -->
          <tr>
            <td align="center" class="banner-img-wrap" style="background-color:#ffffff;padding:0 24px 8px 24px;font-size:0;line-height:0;">
              <!--
                NOTE: border-radius on <img> is ignored in most email clients (Outlook, Gmail).
                The wrapper <td> with padding creates the "inset" look.
                For web previews & Apple Mail, the inline border-radius on the <img> also fires.
              -->
              <img
                class="banner-img"
                src="https://ik.imagekit.io/rider/blogs/Mail.jpg"
                alt="Secure verification illustration"
                width="552"
                style="display:block;border:0;width:100%;max-width:552px;height:auto;border-radius:14px;"
              />
            </td>
          </tr>

          <!-- ─── BODY ─── -->
          <tr>
            <td class="body-cell" style="background-color:#ffffff;padding:36px 48px 32px 48px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">

                <!-- Shield icon -->
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                            <img
                            src="https://ik.imagekit.io/rider/ChatGPT%20Image%20May%204,%202026%20at%2012_11_35%20PM.png"
                            alt="Secure"
                            width="70"
                            height="70"
                            style="display:block;border:0;margin:0 auto;"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <h1 class="otp-title" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.4px;">Verify Your Account</h1>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <p class="otp-subtitle" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#6b7280;line-height:1.65;max-width:400px;">
                      Use the one-time passcode below to complete your verification on <strong style="color:#4f46e5;">Postify</strong>. This code expires in <strong style="color:#111827;">5 minutes</strong>.
                    </p>
                  </td>
                </tr>

                <!-- OTP Block -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:380px;">
                      <tr>
                        <td align="center" class="otp-box" style="background-color:#f5f3ff;border:2px dashed #a5b4fc;border-radius:14px;padding:26px 40px;">
                          <p class="otp-label" style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#6366f1;letter-spacing:2px;text-transform:uppercase;">Your One-Time Passcode</p>
                          <p class="otp-code" style="margin:0;font-family:'Courier New',Courier,monospace;font-size:42px;font-weight:700;color:#312e81;letter-spacing:12px;line-height:1.2;">${otp}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Timer badge -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color:#fef3c7;border-radius:20px;padding:7px 18px;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#92400e;font-weight:600;">&#9200; Expires in 5 minutes</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="border-top:1px solid #e5e7eb;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Security warning -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" style="background-color:#fff1f2;border-left:4px solid #f43f5e;border-radius:0 8px 8px 0;padding:12px 16px;">
                          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9f1239;font-weight:600;">
                            &#128274;&nbsp;&nbsp;Never share this OTP with anyone — including Postify support.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ignore notice -->
                <tr>
                  <td align="center">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9ca3af;line-height:1.6;">
                      Didn't request this? You can safely ignore this email.<br />
                      Your account will remain secure and unchanged.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ─── FOOTER ─── -->
          <tr>
            <td class="footer-cell" align="center" style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <p class="footer-links" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9ca3af;">
                      <a href="https://portfolio-site-kappa-lilac.vercel.app" style="color:#6366f1;text-decoration:none;">Desgin & Developed By Rajat Maurya</a>
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                    
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p class="footer-copy" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#d1d5db;">
                      &copy; 2026 Postify, Inc. All rights reserved.<br />
                      <span style="font-size:11px;">You're receiving this because a sign-in was attempted on your account.</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End card -->

      </td>
    </tr>
  </table>

</body>
</html>`,
  });
 
  return info;
}