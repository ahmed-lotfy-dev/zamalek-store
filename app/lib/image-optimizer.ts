/**
 * Client-side image optimization utilities
 * Compresses, resizes, and converts images to WebP before upload
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.8
  format?: "webp" | "jpeg" | "png";
}

/**
 * Optimizes an image file before upload
 * - Resizes to max dimensions
 * - Compresses with specified quality
 * - Converts to WebP (or specified format)
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = "webp",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;

            if (width > height) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }

          // Create canvas and draw resized image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Use better image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Prepare file metadata
          const mimeType = `image/${format}`;
          const extension = format === "jpeg" ? "jpg" : format;
          const originalName = file.name.replace(/\.[^/.]+$/, "");

          // Convert to blob with specified format and quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob"));
                return;
              }

              // Create new file with optimized image
              const optimizedFile = new File(
                [blob],
                `${originalName}.${extension}`,
                {
                  type: mimeType,
                  lastModified: Date.now(),
                }
              );

              console.log(
                `Image optimized: ${(file.size / 1024).toFixed(1)}KB → ${(
                  optimizedFile.size / 1024
                ).toFixed(1)}KB (${(
                  ((file.size - optimizedFile.size) / file.size) *
                  100
                ).toFixed(1)}% reduction)`
              );

              resolve(optimizedFile);
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Generate a thumbnail from an image
 */
export async function generateThumbnail(
  file: File,
  size: number = 300
): Promise<File> {
  return optimizeImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    format: "webp",
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}
