import { Queue } from "bullmq";
import { connection } from "./redis";
export const emailQueue = new Queue("email-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export async function addEmailJob(name: string, data: any) {
  return emailQueue.add(name, data);
}
