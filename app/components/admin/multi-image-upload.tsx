"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X, Plus } from "lucide-react";
import { getPresignedUrl } from "@/app/lib/actions/upload";
import { optimizeImage, validateImageFile } from "@/app/lib/image-optimizer";
import { Label } from "@/components/ui/label";

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

        // 1. Validate image
        const validation = validateImageFile(file);
        if (!validation.valid) {
          console.warn(`Skipping invalid file ${file.name}:`, validation.error);
          continue;
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

        // 4. Upload to R2
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", optimizedFile.type);

          xhr.onload = () => {
            if (xhr.status === 200) {
              newUrls.push(publicUrl);
              completedFiles++;
              setProgress((completedFiles / totalFiles) * 100);
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error"));
          };

          xhr.send(optimizedFile);
        });
      }

      onChange([...value, ...newUrls]);
      setError(null);
    } catch (error) {
      console.error("Error uploading images:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
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
      <Label>{label}</Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border group"
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={() => handleRemove(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div
          className="aspect-square rounded-xl border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-3 rounded-full bg-muted">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center px-2">
            <p className="text-xs font-medium">Add Images</p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mt-2">
          {error}
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
