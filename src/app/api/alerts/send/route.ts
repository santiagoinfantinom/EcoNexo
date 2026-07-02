import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { rateLimit } from '@/lib/rateLimiter';

type Payload = {
  subject: string;
  message: string;
  channels?: Array<'slack'|'telegram'|'email'>;
};

async function sendSlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return { ok: false, reason: 'no slack url' };
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: message }) });
  return { ok: true };
}

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: 'no telegram config' };
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: message }) });
  return { ok: true };
}

async function sendEmail(subject: string, text: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.ALERT_FROM;
  const to = process.env.ALERT_TO;
  if (!host || !user || !pass || !from || !to) return { ok: false, reason: 'no smtp config' };
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  await transport.sendMail({ from, to, subject, text });
  return { ok: true };
}

export async function POST(req: Request) {
  try {
    const rl = rateLimit(req, 'alerts-send', 5, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      });
    }

    // API key auth: require header `x-alerts-api-key` when ALERTS_API_KEY is set
    const expectedKey = process.env.ALERTS_API_KEY;
    const providedKey = req.headers.get('x-alerts-api-key');

    if (expectedKey) {
      if (!providedKey || providedKey !== expectedKey) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
      }
    } else {
      // no API key configured — allow but log warning (suitable for local/dev)
      console.warn('ALERTS_API_KEY not configured — accepting requests without key');
    }

    const payload: Payload = await req.json();
    const channels = payload.channels || ['slack'];
    const results: any = {};
    const message = `*${payload.subject}*\n${payload.message}`;

    if (channels.includes('slack')) results.slack = await sendSlack(message);
    if (channels.includes('telegram')) results.telegram = await sendTelegram(payload.message);
    if (channels.includes('email')) results.email = await sendEmail(payload.subject, payload.message);

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || String(err) }, { status: 500 });
  }
}
