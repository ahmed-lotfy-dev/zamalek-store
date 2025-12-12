"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Upload, X } from "lucide-react";
import { getPresignedUrl } from "@/app/lib/actions/upload";
import { optimizeImage, validateImageFile } from "@/app/lib/image-optimizer";
import { Label } from "@/components/ui/label";

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
      setProgress(10);
      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        format: "webp",
      });

      setProgress(20);

      // 3. Get presigned URL
      const { uploadUrl, publicUrl } = await getPresignedUrl(
        optimizedFile.name,
        optimizedFile.type,
        folder
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
        if (xhr.status === 200) {
          onChange(publicUrl);
          setIsUploading(false);
          setError(null);
          setProgress(100);
        } else {
          const errorMsg = `Upload failed with status ${xhr.status}: ${xhr.responseText || "Unknown error"}`;
          console.error(errorMsg);
          setError(errorMsg);
          setIsUploading(false);
        }
      };

      xhr.onerror = (event) => {
        const errorMsg = "Network error - This is likely a CORS issue. Check R2 bucket CORS configuration.";
        setError(errorMsg);
        setIsUploading(false);
      };

      xhr.send(optimizedFile);
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
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
      <Label>{label}</Label>

      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border group">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <Button
              size="icon"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-xl border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 rounded-full bg-muted">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (max. 2MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
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
