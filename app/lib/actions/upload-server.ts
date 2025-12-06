"use server";

import { r2 } from "@/app/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

/**
 * Server-side upload alternative (no CORS needed)
 * This uploads the file through the Next.js server instead of directly from browser
 */
export async function uploadToR2Server(
  formData: FormData,
  folder: string = "uploads"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error("R2 configuration missing");
  }

  // Sanitize filename and add timestamp
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
  const key = `${folder}/${Date.now()}-${sanitizedFilename}`;

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await r2.send(command);

  return {
    url: `${publicUrl}/${key}`,
  };
}
