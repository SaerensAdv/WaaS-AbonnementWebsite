/**
 * Transactional Email via Gmail API
 *
 * Uses OAuth2 refresh token to send emails from the workspace Gmail.
 * Env vars (same as analytics, shared credentials):
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN (must include gmail.send scope)
 *
 * Sends via Gmail API (not SMTP), so no Nodemailer needed.
 */

const GMAIL_SENDER = "Abonnement.website <axel@saerensadvertising.com>";

// ─── OAuth2 Token for Gmail ───────────────────────────────────────────────

let gmailToken: { token: string; expiresAt: number } | null = null;

async function getGmailAccessToken(): Promise<string> {
  if (gmailToken && gmailToken.expiresAt > Date.now() + 60000) {
    return gmailToken.token;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Gmail OAuth2 credentials not configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gmail token refresh failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  gmailToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return gmailToken.token;
}

export function isEmailConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

// ─── Gmail API Send ───────────────────────────────────────────────────────

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

function buildRawEmail(options: EmailOptions): string {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const raw = [
    `From: ${GMAIL_SENDER}`,
    `To: ${options.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(options.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(options.html).toString("base64"),
    "",
    `--${boundary}--`,
  ].join("\r\n");

  // Gmail API expects URL-safe base64
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const token = await getGmailAccessToken();
  const raw = buildRawEmail(options);

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`Gmail send failed: ${response.status} ${err}`);
    throw new Error(`Failed to send email: ${response.status}`);
  }
}

// ─── Email Templates ─────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:24px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">abonnement.website</h1>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;">
        Saerens Advertising &middot; abonnement.website
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
  const html = baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Wachtwoord resetten</h2>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">
      Hallo ${name},
    </p>
    <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
      U heeft een verzoek ingediend om uw wachtwoord te resetten. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${resetUrl}" style="display:inline-block;background:#18181b;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">
        Wachtwoord resetten
      </a>
    </div>
    <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.5;">
      Deze link is 1 uur geldig. Als u dit verzoek niet heeft gedaan, kunt u deze e-mail negeren.
    </p>
    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
      Werkt de knop niet? Kopieer deze link:<br>
      <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
    </p>
  `);

  await sendEmail({
    to,
    subject: "Uw wachtwoord resetten - abonnement.website",
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Welkom bij abonnement.website!</h2>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">
      Hallo ${name},
    </p>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">
      Bedankt voor uw registratie. We zijn blij u als klant te verwelkomen.
    </p>
    <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
      U kunt nu inloggen op uw persoonlijke dashboard om uw website-abonnement te beheren, de voortgang van uw project te volgen en support aan te vragen.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="https://app.abonnement.website" style="display:inline-block;background:#18181b;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">
        Naar mijn dashboard
      </a>
    </div>
    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
      Vragen? Stuur een support ticket vanuit uw dashboard of mail naar axel@saerensadvertising.com.
    </p>
  `);

  await sendEmail({
    to,
    subject: "Welkom bij abonnement.website \u{1F44B}",
    html,
  });
}
