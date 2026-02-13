const nodemailer = require('nodemailer');

const { NEO_SMTP_HOST, NEO_SMTP_PORT, NEO_SMTP_USER, NEO_SMTP_PASS, EMAIL_FROM, NODE_ENV } = process.env;

let transporter = null;
if (NEO_SMTP_HOST && NEO_SMTP_USER && NEO_SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: NEO_SMTP_HOST,
    port: Number(NEO_SMTP_PORT) || 587,
    secure: Number(NEO_SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: NEO_SMTP_USER,
      pass: NEO_SMTP_PASS
    }
  });
} else {
  console.warn('Email service not configured (NEO SMTP vars missing). Emails will be logged to console in dev.');
}

async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    // Dev fallback: log and return a dummy result
    const debugResult = { accepted: [to], messageId: 'debug-' + Date.now(), preview: { text, html } };
    console.log('DEV EMAIL SEND', { to, subject, text, html });
    return debugResult;
  }

  const mailOptions = {
    from: EMAIL_FROM || 'no-reply@localhost',
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

module.exports = { sendMail };
