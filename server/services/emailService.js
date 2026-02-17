const nodemailer = require('nodemailer');

const {
  NEO_SMTP_HOST,
  NEO_SMTP_PORT,
  NEO_SMTP_USER,
  NEO_SMTP_PASS,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  SMTP_FROM,
  NODE_ENV
} = process.env;

const smtpHost = NEO_SMTP_HOST || SMTP_HOST;
const smtpPort = Number(NEO_SMTP_PORT || SMTP_PORT) || 587;
const smtpUser = NEO_SMTP_USER || SMTP_USER;
const smtpPass = NEO_SMTP_PASS || SMTP_PASS;
const emailFrom = EMAIL_FROM || SMTP_FROM || 'no-reply@localhost';

let transporter = null;
if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
} else {
  console.warn('Email service not configured (SMTP vars missing). Emails will be logged to console in dev.');
}

function getStatus() {
  return {
    configured: Boolean(transporter),
    mode: transporter ? 'smtp' : 'console',
    host: smtpHost || null,
    port: smtpPort,
    from: emailFrom
  };
}

async function verifyConnection() {
  const status = getStatus();

  if (!transporter) {
    return {
      ok: false,
      configured: false,
      mode: status.mode,
      host: status.host,
      port: status.port,
      message: 'SMTP transporter is not configured'
    };
  }

  try {
    await transporter.verify();
    return {
      ok: true,
      configured: true,
      mode: status.mode,
      host: status.host,
      port: status.port,
      message: 'SMTP connection verified successfully'
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      mode: status.mode,
      host: status.host,
      port: status.port,
      message: (error && error.message) || 'SMTP verification failed'
    };
  }
}

async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    if (NODE_ENV === 'production') {
      throw new Error('Email service is not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS (or NEO_SMTP_* variants).');
    }

    // Dev fallback: log and return a dummy result
    const debugResult = { accepted: [to], messageId: 'debug-' + Date.now(), preview: { text, html } };
    console.log('DEV EMAIL SEND', { to, subject, text, html });
    return debugResult;
  }

  const mailOptions = {
    from: emailFrom,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId, 'to', to);
    return info;
  } catch (err) {
    console.error('Error sending email to', to, err && err.message);
    throw err;
  }
}

module.exports = { sendMail, getStatus, verifyConnection };
