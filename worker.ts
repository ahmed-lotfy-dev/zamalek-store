import { Worker } from "bullmq";
import { connection } from "./app/lib/redis";
import { sendEmail, EMAIL_TEMPLATES } from "./app/lib/email";
import * as dotenv from "dotenv";

dotenv.config();

console.log("Starting email worker...");

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Processing job ${job.id}: ${job.name}`);

    try {
      if (job.name === "ORDER_PLACED") {
        const { email, orderId, total } = job.data;
        const template = EMAIL_TEMPLATES.ORDER_PLACED(orderId, total);
        await sendEmail(email, template.subject, template.text, template.html);
      } else if (job.name === "STATUS_CHANGED") {
        const { email, orderId, status } = job.data;
        const template = EMAIL_TEMPLATES.STATUS_CHANGED(orderId, status);
        await sendEmail(email, template.subject, template.text, template.html);
      }
    } catch (error) {
      console.error(`Failed to process job ${job.id}:`, error);
      throw error;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with ${err.message}`);
});
