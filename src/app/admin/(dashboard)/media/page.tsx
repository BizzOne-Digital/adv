"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, Link as LinkIcon, Copy } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin-fetch";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import type { MediaAsset } from "@/types";
import { slugify } from "@/lib/utils";

type UploadListItem = {
  _id: string;
  folder: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt?: string;
};

export default function MediaPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [uploads, setUploads] = useState<UploadListItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [urlPaste, setUrlPaste] = useState("");
  const [latestUrl, setLatestUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [media, mongoUploads] = await Promise.all([
        adminFetch<{ items: MediaAsset[] }>(
          `/api/admin/media?q=${encodeURIComponent(q)}&limit=60`,
        ),
        adminFetch<{ items: UploadListItem[] }>("/api/admin/uploads?limit=60").catch(
          () => ({ items: [] as UploadListItem[] }),
        ),
      ]);
      setItems(media.items);
      setUploads(mongoUploads.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 200);
    return () => clearTimeout(t);
  }, [load]);

  const registerUrl = async () => {
    if (!urlPaste.trim()) return;
    try {
      const url = resolveCmsImage(urlPaste.trim());
      await adminFetch("/api/admin/media", {
        method: "POST",
        body: JSON.stringify({
          publicId: `url:${slugify(url).slice(0, 80)}-${Date.now()}`,
          url,
          secureUrl: url,
          resourceType: "image",
          alt: "External media",
          tags: ["url-paste"],
        }),
      });
      toast.success("URL registered");
      setUrlPaste("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to register URL");
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Could not copy URL");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Media library</h2>
        <p className="mt-1 text-sm text-white/45">
          Uploads are stored in MongoDB and served from{" "}
          <code className="text-lime/80">/api/uploads/…</code> — works on Vercel
          without Cloudinary.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ImageUploadField
          label="Upload to MongoDB (misc)"
          folder="misc"
          value={latestUrl}
          onChange={(url) => {
            setLatestUrl(url);
            void load();
          }}
        />
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-medium text-white/50">
            Or register an external / existing URL
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px] flex-1">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={urlPaste}
                onChange={(e) => setUrlPaste(e.target.value)}
                placeholder="https://… or /api/uploads/…"
                className="w-full rounded-md border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white focus:border-lime/40 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void registerUrl()}
              className="rounded-md border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-lime/40 hover:text-lime"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search registered media…"
          className="w-full rounded-md border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white focus:border-lime/40 focus:outline-none"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">MongoDB uploads</h3>
        {loading && uploads.length === 0 ? (
          <p className="text-sm text-white/45">Loading…</p>
        ) : uploads.length === 0 ? (
          <EmptyAdminState
            title="No Mongo uploads yet"
            description="Use the uploader above. Files persist in Atlas across Vercel deploys."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {uploads.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg border border-white/10 bg-black/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.filename}
                  className="aspect-square w-full object-cover"
                />
                <div className="space-y-1 p-2">
                  <p className="truncate text-[10px] text-white/55">{item.folder}/{item.filename}</p>
                  <button
                    type="button"
                    onClick={() => void copyUrl(item.url)}
                    className="inline-flex items-center gap-1 text-[10px] text-lime hover:underline"
                  >
                    <Copy className="h-3 w-3" />
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Registered library</h3>
        {items.length === 0 ? (
          <p className="text-sm text-white/40">No registered MediaAsset records.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => {
              const src = resolveCmsImage(item.secureUrl || item.url);
              return (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.alt || item.publicId}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteId(item._id)}
                    className="absolute right-2 top-2 rounded bg-black/60 p-1.5 text-white/70 opacity-0 transition group-hover:opacity-100 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete media?"
        description="Removes the library record. MongoDB binary uploads are managed separately."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await adminFetch(`/api/admin/media/${deleteId}`, { method: "DELETE" });
          toast.success("Deleted");
          setDeleteId(null);
          await load();
        }}
      />
    </div>
  );
}
