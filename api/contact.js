// Vercel serverless function: sends website inquiries to the office by email through Brevo.
// Env vars (Vercel → Project → Settings → Environment Variables):
//   BREVO_API_KEY   – Brevo API key (required)
//   CONTACT_TO      – where inquiries go (default info@prdsbi.com)
//   CONTACT_SENDER  – a sender address verified in Brevo (default info@prdsbi.com)
//   CONTACT_CC      – optional, comma-separated addresses that get a copy of every inquiry
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  const key = process.env.BREVO_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'not-configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (b._honey) return res.status(200).json({ ok: true }); // bot trap: pretend success

  const name = clip(b.name, 120), phone = clip(b.phone, 40), email = clip(b.email, 160), message = clip(b.message, 5000);
  const lang = b.lang === 'en' ? 'en' : 'he';
  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid' });

  const to = process.env.CONTACT_TO || 'info@prdsbi.com';
  const sender = process.env.CONTACT_SENDER || 'info@prdsbi.com';
  const cc = (process.env.CONTACT_CC || '').split(',').map(s => s.trim()).filter(s => s && s.toLowerCase() !== to.toLowerCase());
  const L = lang === 'en'
    ? { subject: 'Website inquiry (English site)', name: 'Name', phone: 'Phone', email: 'Email', message: 'Message' }
    : { subject: 'פנייה חדשה מהאתר', name: 'שם', phone: 'טלפון', email: 'דוא״ל', message: 'הודעה' };
  const row = (k, v) => `<tr><td style="padding:8px 12px;font-weight:700;border-bottom:1px solid #e5e7eb;white-space:nowrap">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${esc(v).replace(/\n/g, '<br>')}</td></tr>`;
  const html = `<div dir="${lang === 'en' ? 'ltr' : 'rtl'}" style="font-family:Arial,sans-serif;font-size:15px;color:#0f1f3d">
<h2 style="margin:0 0 12px">${esc(L.subject)}</h2>
<table style="border-collapse:collapse;min-width:320px">${row(L.name, name)}${row(L.phone, phone)}${row(L.email, email)}${message ? row(L.message, message) : ''}</table></div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'P.R.D.S Website', email: sender },
        to: [{ email: to }],
        ...(cc.length ? { cc: cc.map(email => ({ email })) } : {}),
        replyTo: { email, name },
        subject: `${L.subject} — ${name}`,
        htmlContent: html
      })
    });
    if (!r.ok) { console.error('Brevo error', r.status, await r.text()); return res.status(502).json({ ok: false, error: 'send-failed' }); }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Brevo request failed', e);
    return res.status(502).json({ ok: false, error: 'send-failed' });
  }
};
