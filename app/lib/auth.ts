import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],
  // Add other plugins or providers here
});
