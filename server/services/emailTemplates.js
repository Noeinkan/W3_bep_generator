function verificationEmail({ name, verificationUrl }) {
  const subject = 'Verify your BEP Generator email address';
  const text = `Hello ${name || ''},\n\nPlease verify your email by visiting the following link:\n${verificationUrl}\n\nIf you did not create an account, you can ignore this message.`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111">
      <h2>Verify your email</h2>
      <p>Hello ${name || ''},</p>
      <p>Click the button below to verify your email address for BEP Generator.</p>
      <p><a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a></p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <hr />
      <small>If you didn't request this, you can safely ignore this email.</small>
    </div>
  `;
  return { subject, text, html };
}

function passwordResetEmail({ name, resetUrl }) {
  const subject = 'BEP Generator password reset';
  const text = `Hello ${name || ''},\n\nYou can reset your password by visiting the following link:\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111">
      <h2>Password reset</h2>
      <p>Hello ${name || ''},</p>
      <p>Click the button below to reset your password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#db2777;color:#fff;border-radius:6px;text-decoration:none;">Reset password</a></p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <hr />
      <small>If you didn't request this, you can safely ignore this email.</small>
    </div>
  `;
  return { subject, text, html };
}

module.exports = { verificationEmail, passwordResetEmail };
