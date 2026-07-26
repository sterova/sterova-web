/**
 * Email service via Resend.
 *
 * Gracefully degrades when RESEND_API_KEY is not set — contact form
 * submissions are still persisted in Supabase. Once the key is added,
 * email notifications work without any code changes.
 */

interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}

interface EmailResult {
  sent: boolean;
  error?: string;
}

function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "re_your-resend-api-key" &&
      process.env.CONTACT_EMAIL
  );
}

export async function sendContactNotification(
  payload: ContactEmailPayload
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.info(
      "[Email] Resend not configured — skipping notification email. " +
        "Set RESEND_API_KEY and CONTACT_EMAIL to enable."
    );
    return { sent: false };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromEmail =
      process.env.FROM_EMAIL ?? process.env.CONTACT_EMAIL ?? "hello@sterova.tech";
    const toEmail = process.env.CONTACT_EMAIL!;

    const { error } = await resend.emails.send({
      from: `Sterova Contact Form <${fromEmail}>`,
      to: [toEmail],
      reply_to: payload.email,
      subject: `New inquiry from ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`,
      html: buildContactEmailHtml(payload),
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[Email] Failed to send:", message);
    return { sent: false, error: message };
  }
}

export async function sendContactConfirmation(
  payload: Pick<ContactEmailPayload, "name" | "email">
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    return { sent: false };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromEmail =
      process.env.FROM_EMAIL ?? process.env.CONTACT_EMAIL ?? "hello@sterova.tech";

    const { error } = await resend.emails.send({
      from: `Sterova <${fromEmail}>`,
      to: [payload.email],
      subject: "We received your message — Sterova",
      html: buildConfirmationEmailHtml(payload.name),
    });

    if (error) {
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { sent: false, error: message };
  }
}

function buildContactEmailHtml(payload: ContactEmailPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e1b4b; margin: 0; padding: 0; background: #f8f9ff; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e7ff; }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6366f1; margin-bottom: 6px; }
    .value { font-size: 15px; color: #1e1b4b; background: #f8f9ff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e0e7ff; }
    .message-value { white-space: pre-wrap; }
    .footer { padding: 20px 32px; background: #f8f9ff; border-top: 1px solid #e0e7ff; font-size: 13px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Inquiry</h1>
      <p>Sterova — New message received from the website</p>
    </div>
    <div class="body">
      <div class="field"><div class="label">Name</div><div class="value">${payload.name}</div></div>
      <div class="field"><div class="label">Email</div><div class="value">${payload.email}</div></div>
      ${payload.company ? `<div class="field"><div class="label">Company</div><div class="value">${payload.company}</div></div>` : ""}
      ${payload.service ? `<div class="field"><div class="label">Service Needed</div><div class="value">${payload.service}</div></div>` : ""}
      ${payload.budget ? `<div class="field"><div class="label">Budget</div><div class="value">${payload.budget}</div></div>` : ""}
      <div class="field"><div class="label">Message</div><div class="value message-value">${payload.message}</div></div>
    </div>
    <div class="footer">
      Reply directly to this email to respond to ${payload.name}.
    </div>
  </div>
</body>
</html>`;
}

function buildConfirmationEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e1b4b; margin: 0; padding: 0; background: #f8f9ff; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e7ff; }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .body { padding: 40px 32px; text-align: center; }
    .body p { font-size: 16px; line-height: 1.7; color: #374151; margin: 0 0 20px; }
    .cta { display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
    .footer { padding: 20px 32px; background: #f8f9ff; border-top: 1px solid #e0e7ff; font-size: 13px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sterova</h1>
    </div>
    <div class="body">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out. We've received your message and will get back to you within <strong>24 hours</strong>.</p>
      <p>In the meantime, feel free to learn more about our work:</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sterova.tech"}/portfolio" class="cta">View Our Portfolio</a>
      <p style="font-size:14px;color:#6b7280;">— The Sterova Team</p>
    </div>
    <div class="footer">
      Sterova · hello@sterova.tech
    </div>
  </div>
</body>
</html>`;
}
