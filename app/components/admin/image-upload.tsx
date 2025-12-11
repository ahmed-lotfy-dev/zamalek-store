"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Progress } from "@heroui/progress";

import { Upload, X, Image as ImageIcon } from "lucide-react";
import { getPresignedUrl } from "@/app/lib/actions/upload";
import { optimizeImage, validateImageFile } from "@/app/lib/image-optimizer";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      // 1. Validate image
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setIsUploading(false);
        return;
      }

      // 2. Optimize image (compress, resize, convert to WebP)
      console.log(
        "Optimizing image:",
        file.name,
        `${(file.size / 1024).toFixed(1)}KB`
      );
      setProgress(10);

      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        format: "webp",
      });

      setProgress(20);

      // 3. Get presigned URL
      console.log(
        "Getting presigned URL for:",
        optimizedFile.name,
        optimizedFile.type
      );
      const { uploadUrl, publicUrl } = await getPresignedUrl(
        optimizedFile.name,
        optimizedFile.type,
        folder
      );
      console.log(
        "Presigned URL received:",
        uploadUrl.substring(0, 100) + "..."
      );
      setProgress(30);

      // 4. Upload to R2
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", optimizedFile.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // Progress from 30% to 100%
          const uploadProgress = (event.loaded / event.total) * 70;
          setProgress(30 + uploadProgress);
        }
      };

      xhr.onload = () => {
        console.log(
          "XHR onload - Status:",
          xhr.status,
          "Response:",
          xhr.responseText
        );
        if (xhr.status === 200) {
          onChange(publicUrl);
          setIsUploading(false);
          setError(null);
          setProgress(100);
        } else {
          const errorMsg = `Upload failed with status ${xhr.status}: ${xhr.responseText || "Unknown error"
            }`;
          console.error(errorMsg);
          setError(errorMsg);
          setIsUploading(false);
        }
      };

      xhr.onerror = (event) => {
        console.error("XHR error event:", event);
        console.error("XHR status:", xhr.status);
        console.error("XHR readyState:", xhr.readyState);
        const errorMsg =
          "Network error - This is likely a CORS issue. Check R2 bucket CORS configuration.";
        setError(errorMsg);
        setIsUploading(false);
      };

      console.log("Sending optimized file to R2...");
      xhr.send(optimizedFile);
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMsg);
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-small font-medium text-foreground">{label}</label>

      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-default-200 group">
          <Image
            src={value}
            alt="Uploaded image"
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
              onPress={handleRemove}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-xl border-2 border-dashed border-default-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 rounded-full bg-default-100">
            <Upload className="w-6 h-6 text-default-500" />
          </div>
          <div className="text-center">
            <p className="text-small font-medium">Click to upload</p>
            <p className="text-tiny text-default-400">
              SVG, PNG, JPG or GIF (max. 2MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
          <p className="text-small text-danger-600">{error}</p>
        </div>
      )}

      {isUploading && (
        <Progress
          size="sm"
          value={progress}
          color="primary"
          className="max-w-md"
          label="Uploading..."
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
}
