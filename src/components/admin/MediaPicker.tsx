"use client";

import { useEffect, useState } from "react";
import { Search, Upload, X, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { adminFetch } from "@/lib/admin-fetch";
import { compressImageForUpload } from "@/lib/upload/compress-client";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import type { MediaAsset, MediaRef } from "@/types";
import { cn } from "@/lib/utils";

export type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaRef) => void;
  title?: string;
  /** Mongo upload folder for new files */
  folder?: "pages" | "products" | "gallery" | "misc";
};

type UploadResponse = {
  url: string;
  filename: string;
  folder: string;
  size: number;
};

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Select media",
  folder = "misc",
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlPaste, setUrlPaste] = useState("");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void (async () => {
        setLoading(true);
        try {
          const data = await adminFetch<{ items: MediaAsset[] }>(
            `/api/admin/media?q=${encodeURIComponent(q)}&limit=48`,
          );
          if (!cancelled) setItems(data.items);
        } catch (err) {
          if (!cancelled) {
            toast.error(err instanceof Error ? err.message : "Failed to load media");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [open, q]);

  if (!open) return null;

  const handleUpload = async (file: File) => {
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
      setUploadedUrl(data.url);
      setSelected(null);
      setUrlPaste("");
      toast.success("Uploaded to MongoDB");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const confirm = () => {
    if (uploadedUrl) {
      onSelect({ url: uploadedUrl, alt: "" });
      onClose();
      return;
    }
    if (selected) {
      onSelect({
        url: resolveCmsImage(selected.secureUrl || selected.url),
        publicId: selected.publicId,
        alt: selected.alt,
        width: selected.width,
        height: selected.height,
        caption: selected.caption,
      });
      onClose();
      return;
    }
    if (urlPaste.trim()) {
      onSelect({ url: resolveCmsImage(urlPaste.trim()), alt: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d2f24] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search media…"
              className="w-full rounded-md border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-lime/40 focus:outline-none"
            />
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-medium text-white/80 hover:border-lime/40 hover:text-lime">
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {uploadedUrl ? (
            <div className="mb-4 overflow-hidden rounded-lg border border-lime/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedUrl} alt="Uploaded" className="max-h-48 w-full object-cover" />
              <p className="truncate bg-black/30 px-3 py-2 text-[11px] text-lime">{uploadedUrl}</p>
            </div>
          ) : null}

          {loading ? (
            <p className="text-sm text-white/50">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-white/50">
              No library items yet. Upload an image (stored in MongoDB — works on Vercel).
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {items.map((item) => {
                const src = resolveCmsImage(item.secureUrl || item.url);
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      setUploadedUrl("");
                    }}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border bg-black/30",
                      selected?._id === item._id
                        ? "border-lime ring-2 ring-lime/40"
                        : "border-white/10 hover:border-white/30",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={item.alt || item.publicId}
                      className="h-full w-full object-cover"
                    />
                    {selected?._id === item._id ? (
                      <span className="absolute right-1 top-1 rounded-full bg-lime p-0.5 text-forest">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
              <LinkIcon className="h-3.5 w-3.5" />
              Or paste image URL
            </label>
            <input
              value={urlPaste}
              onChange={(e) => {
                setUrlPaste(e.target.value);
                setSelected(null);
                setUploadedUrl("");
              }}
              placeholder="https://… or /api/uploads/…"
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-lime/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!selected && !urlPaste.trim() && !uploadedUrl}
            className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest hover:bg-lime/90 disabled:opacity-50"
          >
            Use media
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaPicker;
