"use server";

import { r2 } from "@/app/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function deleteImageFromR2(imageUrl: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error("R2 configuration missing");
  }

  try {
    // Extract key from URL
    // URL format: https://<public-url>/<key>
    // or just the key if passed directly
    let key = imageUrl;
    if (imageUrl.startsWith(publicUrl)) {
      key = imageUrl.replace(`${publicUrl}/`, "");
    } else if (imageUrl.startsWith("http")) {
       // fallback if publicUrl doesn't match exactly (e.g. protocol difference)
       const url = new URL(imageUrl);
       key = url.pathname.substring(1); // remove leading /
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return { success: false, error };
  }
}

export async function getPresignedUrl(
  filename: string,
  contentType: string,
  folder: string = "uploads"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error("R2 configuration missing");
  }

  // Sanitize filename and add timestamp
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "");
  const key = `${folder}/${Date.now()}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

  return {
    uploadUrl,
    publicUrl: `${publicUrl}/${key}`,
  };
}
