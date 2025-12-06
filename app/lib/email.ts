import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN || "";
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "hello@example.com";

const client = new MailtrapClient({ token: TOKEN });

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  if (!TOKEN) {
    console.warn("MAILTRAP_TOKEN is not set. Email sending skipped.");
    return;
  }

  try {
    await client.send({
      from: { name: "E-Commerce Store", email: SENDER_EMAIL },
      to: [{ email: to }],
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
