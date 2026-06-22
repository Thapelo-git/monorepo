import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
  });
}

export async function sendInviteEmail(opts: {
  to: string;
  inviteLink: string;
  weddingName: string;
  plannerName: string;
}) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@weddingflow.com";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #f7f3ee; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #1B2B4B 0%, #8b4a6b 100%); padding: 40px; text-align: center;">
      <h1 style="color: white; font-size: 28px; margin: 0;">💍 WeddingFlow</h1>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">You've been invited!</h2>
      <p style="color: #6b7280; line-height: 1.6;">
        <strong>${opts.plannerName}</strong> has invited you to access your wedding planning board for
        <strong>${opts.weddingName}</strong>.
      </p>
      <p style="color: #6b7280; line-height: 1.6;">
        Click the button below to set up your account and start exploring your wedding details.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${opts.inviteLink}"
           style="display: inline-block; background: linear-gradient(135deg, #1B2B4B 0%, #8b4a6b 100%);
                  color: white; text-decoration: none; padding: 14px 32px;
                  border-radius: 8px; font-size: 16px; font-weight: 600;">
          Accept Invitation
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 13px; text-align: center;">
        Or copy this link: <a href="${opts.inviteLink}" style="color: #1B2B4B;">${opts.inviteLink}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
        This invite expires in 7 days. If you didn't expect this email, you can ignore it.
      </p>
    </div>
  </div>
</body>
</html>`;

  if (!transporter) {
    // Dev fallback: print the link to the console
    console.log("\n═══════════════════════════════════════════");
    console.log("  INVITE EMAIL (SMTP not configured)");
    console.log("  To:    ", opts.to);
    console.log("  Link:  ", opts.inviteLink);
    console.log("═══════════════════════════════════════════\n");
    return;
  }

  await transporter.sendMail({
    from: `WeddingFlow <${from}>`,
    to: opts.to,
    subject: `You're invited to ${opts.weddingName} on WeddingFlow`,
    html,
  });
}
