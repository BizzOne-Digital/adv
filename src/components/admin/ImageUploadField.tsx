"use client";

import Image from "next/image";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { adminFetch } from "@/lib/admin-fetch";
import { compressImageForUpload } from "@/lib/upload/compress-client";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import type { UploadFolder } from "@/models/StoredUpload";
import { cn } from "@/lib/utils";

export type ImageUploadFieldProps = {
  value?: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  className?: string;
  /** Optional alt text for preview */
  alt?: string;
};

type UploadResponse = {
  url: string;
  filename: string;
  folder: string;
  size: number;
};

export function ImageUploadField({
  value,
  onChange,
  folder,
  label = "Image",
  className,
  alt = "",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = resolveCmsImage(value, "");

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const prepared = await compressImageForUpload(file);
      const form = new FormData();
      form.append("file", prepared);
      form.append("folder", folder);

      const data = await adminFetch<UploadResponse>("/api/upload", {
        method: "POST",
        body: form,
      });

      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-white/50">{label}</label>
        {preview ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-[11px] text-white/45 hover:text-red-300"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
        <div className="relative aspect-[16/10] w-full">
          {preview ? (
            <Image
              src={preview}
              alt={alt || label}
              fill
              unoptimized={preview.startsWith("/api/uploads/")}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/35">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">No image selected</span>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55">
              <Loader2 className="h-6 w-6 animate-spin text-lime" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-3">
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-medium text-white/80 hover:border-lime/40 hover:text-lime",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {preview ? "Replace image" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
          {preview ? (
            <span className="truncate text-[10px] text-white/35">{preview}</span>
          ) : (
            <span className="text-[10px] text-white/35">
              JPEG / PNG / WebP / GIF · max 4.5MB (auto-compressed)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadField;
