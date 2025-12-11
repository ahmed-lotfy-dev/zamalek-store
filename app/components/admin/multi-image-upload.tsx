"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Image } from "@heroui/image";

import { Upload, X, Plus } from "lucide-react";
import { getPresignedUrl } from "@/app/lib/actions/upload";
import { optimizeImage, validateImageFile } from "@/app/lib/image-optimizer";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  folder = "uploads",
  label = "Images",
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      const newUrls: string[] = [];
      const totalFiles = files.length;
      let completedFiles = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];

        console.log(
          `Processing file ${i + 1}/${totalFiles}:`,
          file.name,
          `${(file.size / 1024).toFixed(1)}KB`
        );

        // 1. Validate image
        const validation = validateImageFile(file);
        if (!validation.valid) {
          console.warn(`Skipping invalid file ${file.name}:`, validation.error);
          continue; // Skip invalid files instead of failing entire upload
        }

        // 2. Optimize image
        const optimizedFile = await optimizeImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          format: "webp",
        });

        // 3. Get presigned URL
        const { uploadUrl, publicUrl } = await getPresignedUrl(
          optimizedFile.name,
          optimizedFile.type,
          folder
        );
        console.log("Presigned URL received for", optimizedFile.name);

        // 4. Upload to R2
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", optimizedFile.type);

          xhr.onload = () => {
            console.log(`File ${i + 1} upload status:`, xhr.status);
            if (xhr.status === 200) {
              newUrls.push(publicUrl);
              completedFiles++;
              setProgress((completedFiles / totalFiles) * 100);
              resolve();
            } else {
              const errorMsg = `Upload failed with status ${xhr.status}: ${xhr.responseText || "Unknown error"
                }`;
              console.error(errorMsg);
              reject(new Error(errorMsg));
            }
          };

          xhr.onerror = (event) => {
            console.error("XHR error for file", optimizedFile.name, ":", event);
            console.error(
              "XHR status:",
              xhr.status,
              "readyState:",
              xhr.readyState
            );
            reject(
              new Error(
                "Network error - This is likely a CORS issue. Check R2 bucket CORS configuration."
              )
            );
          };

          xhr.send(optimizedFile);
        });
      }

      onChange([...value, ...newUrls]);
      setError(null);
    } catch (error) {
      console.error("Error uploading images:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMsg);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-small font-medium text-foreground">{label}</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-default-200 group"
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              classNames={{
                wrapper: "w-full h-full",
                img: "w-full h-full object-cover",
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => handleRemove(url)}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        ))}

        <div
          className="aspect-square rounded-xl border-2 border-dashed border-default-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-3 rounded-full bg-default-100">
            <Plus className="w-6 h-6 text-default-500" />
          </div>
          <div className="text-center px-2">
            <p className="text-tiny font-medium">Add Images</p>
          </div>
        </div>
      </div>

      {isUploading && (
        <Progress
          size="sm"
          value={progress}
          color="primary"
          className="max-w-md mt-2"
          label={`Uploading... ${Math.round(progress)}%`}
        />
      )}

      {error && (
        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 mt-2">
          <p className="text-small text-danger-600">{error}</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
}
