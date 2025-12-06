import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const SMTP_HOST = process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io";
  const SMTP_PORT = parseInt(process.env.MAILTRAP_PORT || "2525");
  const SMTP_USER = process.env.MAILTRAP_USER;
  const SMTP_PASS = process.env.MAILTRAP_PASS;
  const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "hello@example.com";

  console.log("Debug Env Vars:", {
    HOST: SMTP_HOST,
    PORT: SMTP_PORT,
    USER_SET: !!SMTP_USER,
    PASS_SET: !!SMTP_PASS,
  });

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn(
      "MAILTRAP_USER or MAILTRAP_PASS is not set. Email sending skipped."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"E-Commerce Store" <${SENDER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export const EMAIL_TEMPLATES = {
  ORDER_PLACED: (orderId: string, total: number) => ({
    subject: `Order Confirmation #${orderId}`,
    text: `Thank you for your order! Your order #${orderId} for $${total} has been placed successfully.`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>#${orderId}</strong> for <strong>$${total}</strong> has been placed successfully.</p>
      <p>We will notify you when it ships.</p>
    `,
  }),
  STATUS_CHANGED: (orderId: string, status: string) => ({
    subject: `Order Status Update #${orderId}`,
    text: `Your order #${orderId} status has been updated to: ${status}.`,
    html: `
      <h1>Order Update</h1>
      <p>Your order <strong>#${orderId}</strong> status has been updated to: <strong>${status}</strong>.</p>
    `,
  }),
};
