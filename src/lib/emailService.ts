import 'server-only';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using nodemailer
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // If no SMTP configured, log to console
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email would be sent (SMTP not configured):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.html);
      return { success: true, message: 'Email logged (SMTP not configured)' };
    }

    await transporter.sendMail({
      from: options.from || process.env.NEXT_PUBLIC_EMAIL_FROM || 'noreply@econexo.app',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true, message: 'Email enviado correctamente' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error al enviar el email' };
  }
}

/**
 * Send welcome email with verification link
 */
export async function sendWelcomeVerificationEmail(email: string, token: string, locale: string = 'en'): Promise<{ success: boolean; message: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  // Localized content
  const translations = {
    es: {
      subject: '¡Bienvenido a EcoNexo! Verifica tu cuenta',
      greeting: '¡Hola! 👋',
      welcome: '¡Bienvenido a EcoNexo!',
      message1: 'Estamos emocionados de tenerte con nosotros. Juntos podemos crear un mundo más sostenible y conectado.',
      message2: 'En EcoNexo, creemos que cada acción cuenta. Cada evento, cada proyecto y cada persona que se une a nuestra comunidad contribuye a un futuro mejor para nuestro planeta.',
      message3: 'Tu participación es crucial. Ya sea uniéndote a un evento, compartiendo conocimiento, o conectando con otros agentes de cambio, estás haciendo la diferencia.',
      verifyTitle: 'Verifica tu cuenta:',
      verifyButton: 'Verificar mi cuenta',
      verifyNote: 'O copia y pega este enlace en tu navegador:',
      footer1: 'Estamos aquí para apoyarte. Si tienes alguna pregunta, no dudes en contactarnos.',
      footer2: 'Gracias por ser parte del cambio.',
      footer3: 'Con amor,',
      team: 'El equipo de EcoNexo 🌿',
    },
    en: {
      subject: 'Welcome to EcoNexo! Verify your account',
      greeting: 'Hello! 👋',
      welcome: 'Welcome to EcoNexo!',
      message1: 'We\'re excited to have you with us. Together we can create a more sustainable and connected world.',
      message2: 'At EcoNexo, we believe that every action matters. Every event, every project, and every person who joins our community contributes to a better future for our planet.',
      message3: 'Your participation is crucial. Whether joining an event, sharing knowledge, or connecting with other changemakers, you\'re making a difference.',
      verifyTitle: 'Verify your account:',
      verifyButton: 'Verify my account',
      verifyNote: 'Or copy and paste this link in your browser:',
      footer1: 'We\'re here to support you. If you have any questions, feel free to contact us.',
      footer2: 'Thank you for being part of the change.',
      footer3: 'With love,',
      team: 'The EcoNexo team 🌿',
    },
    de: {
      subject: 'Willkommen bei EcoNexo! Bestätige dein Konto',
      greeting: 'Hallo! 👋',
      welcome: 'Willkommen bei EcoNexo!',
      message1: 'Wir freuen uns, dich bei uns zu haben. Zusammen können wir eine nachhaltigere und verbundene Welt schaffen.',
      message2: 'Bei EcoNexo glauben wir, dass jede Aktion zählt. Jede Veranstaltung, jedes Projekt und jede Person, die sich unserer Gemeinschaft anschließt, trägt zu einer besseren Zukunft für unseren Planeten bei.',
      message3: 'Deine Teilnahme ist entscheidend. Egal, ob du an einer Veranstaltung teilnimmst, Wissen teilst oder dich mit anderen Changemakers verbindest, du machst einen Unterschied.',
      verifyTitle: 'Bestätige dein Konto:',
      verifyButton: 'Mein Konto bestätigen',
      verifyNote: 'Oder kopiere diesen Link in deinen Browser:',
      footer1: 'Wir sind für dich da. Wenn du Fragen hast, zögere nicht, uns zu kontaktieren.',
      footer2: 'Vielen Dank, dass du Teil des Wandels bist.',
      footer3: 'Mit Liebe,',
      team: 'Das EcoNexo-Team 🌿',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.es;

  const htmlContent = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo {
      text-align: center;
      font-size: 32px;
      margin-bottom: 20px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #2d5f4f;
    }
    .message {
      margin: 20px 0;
      color: #4a5568;
    }
    .verify-box {
      background-color: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 10px 0;
    }
    .link {
      word-break: break-all;
      color: #10b981;
      font-size: 12px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .team {
      margin-top: 10px;
      font-weight: 600;
      color: #2d5f4f;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🌿 EcoNexo</div>
    
    <div class="greeting">${t.greeting}</div>
    
    <h1>${t.welcome}</h1>
    
    <div class="message">
      <p>${t.message1}</p>
      <p>${t.message2}</p>
      <p>${t.message3}</p>
    </div>
    
    <div class="verify-box">
      <p style="margin-bottom: 15px; font-weight: 600; color: #2d5f4f;">${t.verifyTitle}</p>
      <a href="${verificationUrl}" class="button">${t.verifyButton}</a>
      <p style="margin-top: 15px; font-size: 12px;">${t.verifyNote}</p>
      <p class="link">${verificationUrl}</p>
    </div>
    
    <div class="footer">
      <p>${t.footer1}</p>
      <p>${t.footer2}</p>
      <p style="margin-top: 20px;">${t.footer3}</p>
      <p class="team">${t.team}</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: t.subject,
    html: htmlContent,
  });
}

