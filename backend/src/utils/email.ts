import nodemailer from "nodemailer";

/**
 * Send OTP verification email.
 * If EMAIL_USER / EMAIL_PASS are not configured, logs the OTP to the console
 * instead of crashing — useful during local development without a mail server.
 */
export const sendOTPEmail = async (to: string, otp: string, name: string): Promise<void> => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // ── Dev mode: no email creds → print to console ──────────────────────────
  if (!user || !pass || user.trim() === "" || pass.trim() === "") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║   📧  ResearchAI — OTP (Dev Mode)    ║");
    console.log("╠══════════════════════════════════════╣");
    console.log(`║  To   : ${to.padEnd(30)} ║`);
    console.log(`║  Name : ${name.padEnd(30)} ║`);
    console.log(`║  OTP  : ${otp.padEnd(30)} ║`);
    console.log("╚══════════════════════════════════════╝\n");
    return; // skip actual sending
  }

  // ── Production: send real email ───────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"ResearchAI" <${user}>`,
    to,
    subject: "Your ResearchAI Verification Code",
    html: `
      <div style="font-family:Inter,sans-serif;background:#050816;color:#fff;padding:40px;border-radius:16px;max-width:500px;margin:auto">
        <h2 style="color:#4F46E5;margin-bottom:8px">ResearchAI</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your email verification code is:</p>
        <div style="font-size:36px;font-weight:700;color:#00D4FF;letter-spacing:12px;padding:20px 0;text-align:center">
          ${otp}
        </div>
        <p style="color:#aaa">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border-color:#333;margin:24px 0"/>
        <p style="color:#666;font-size:12px">© 2024 ResearchAI — Intelligent Research Assistant</p>
      </div>
    `,
  });
};
