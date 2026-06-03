import 'server-only';

import {Resend} from 'resend';

let cached: Resend | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

const FROM = 'Samimi Spor Kulübü <info@samimisportsclub.com>';

type ContactPayload = {
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  locale: 'tr' | 'en';
};

const SUBJECT_LABELS: Record<'tr' | 'en', Record<string, string>> = {
  tr: {
    general: 'Genel Bilgi',
    reservation: 'Rezervasyon',
    branch: 'Branş Bilgisi',
    other: 'Diğer'
  },
  en: {
    general: 'General info',
    reservation: 'Reservation',
    branch: 'Class info',
    other: 'Other'
  }
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(p: ContactPayload): string {
  const subjectLabel = p.subject
    ? SUBJECT_LABELS[p.locale][p.subject] ?? p.subject
    : '—';
  const emailRow = p.email
    ? `<tr><td style="padding:8px 12px;color:#6b7280;width:140px;">E-posta</td><td style="padding:8px 12px;color:#0f0f0f;"><a href="mailto:${escapeHtml(p.email)}" style="color:#0f0f0f;">${escapeHtml(p.email)}</a></td></tr>`
    : '';

  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:24px;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f0f0f;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:2px solid #e5e7eb;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#FACC15;padding:20px 24px;">
          <h1 style="margin:0;font-size:18px;letter-spacing:0.08em;color:#0f0f0f;">YENİ İLETİŞİM MESAJI</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 12px;color:#6b7280;width:140px;">Ad Soyad</td><td style="padding:8px 12px;color:#0f0f0f;">${escapeHtml(p.name)}</td></tr>
            <tr><td style="padding:8px 12px;color:#6b7280;">Telefon</td><td style="padding:8px 12px;color:#0f0f0f;"><a href="tel:${escapeHtml(p.phone)}" style="color:#0f0f0f;">${escapeHtml(p.phone)}</a></td></tr>
            ${emailRow}
            <tr><td style="padding:8px 12px;color:#6b7280;">Konu</td><td style="padding:8px 12px;color:#0f0f0f;">${escapeHtml(subjectLabel)}</td></tr>
          </table>
          <div style="margin-top:18px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
            <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Mesaj</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#0f0f0f;white-space:pre-wrap;">${escapeHtml(p.message)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#fafafa;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
          samimisportsclub.com — iletişim formundan gönderildi
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText(p: ContactPayload): string {
  const subjectLabel = p.subject
    ? SUBJECT_LABELS[p.locale][p.subject] ?? p.subject
    : '—';
  return [
    'YENİ İLETİŞİM MESAJI',
    '',
    `Ad Soyad: ${p.name}`,
    `Telefon : ${p.phone}`,
    p.email ? `E-posta : ${p.email}` : null,
    `Konu    : ${subjectLabel}`,
    '',
    'Mesaj:',
    p.message
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendContactEmail(
  payload: ContactPayload
): Promise<{ok: true} | {ok: false; reason: string}> {
  const to = process.env.CONTACT_EMAIL;
  if (!to) return {ok: false, reason: 'CONTACT_EMAIL not set'};

  const client = getClient();
  if (!client) return {ok: false, reason: 'RESEND_API_KEY not set'};

  const subjectLine = `Yeni İletişim Mesajı - ${payload.name}`;

  const {error} = await client.emails.send({
    from: FROM,
    to,
    replyTo: payload.email ?? undefined,
    subject: subjectLine,
    html: buildHtml(payload),
    text: buildText(payload)
  });

  if (error) {
    return {ok: false, reason: error.message ?? 'Resend send failed'};
  }
  return {ok: true};
}
