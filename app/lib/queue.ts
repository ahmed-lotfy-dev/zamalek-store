import { Queue } from "bullmq";
import { getRedisConnection } from "./redis";

const globalForQueue = global as unknown as { emailQueue: Queue };

export const emailQueue =
  globalForQueue.emailQueue ||
  new Queue("email-queue", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForQueue.emailQueue = emailQueue;

export async function addEmailJob(name: string, data: any) {
  return emailQueue.add(name, data);
}
