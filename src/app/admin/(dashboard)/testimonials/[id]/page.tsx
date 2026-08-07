"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import type { Testimonial } from "@/types";

export default function TestimonialEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    name: "",
    role: "",
    organization: "",
    country: "",
    quote: "",
    imageUrl: "",
    featured: false,
    approved: true,
    isSample: false,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<Testimonial>(
          `/api/admin/testimonials/${params.id}`,
        );
        setForm({
          name: data.name || "",
          role: data.role || "",
          organization: data.organization || "",
          country: data.country || "",
          quote: data.quote || "",
          imageUrl: data.image?.url || "",
          featured: Boolean(data.featured),
          approved: Boolean(data.approved),
          isSample: Boolean(data.isSample),
          order: data.order ?? 0,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, params.id]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const payload = () => ({
    name: form.name,
    role: form.role || undefined,
    organization: form.organization || undefined,
    country: form.country || undefined,
    quote: form.quote,
    image: form.imageUrl
      ? { url: form.imageUrl, alt: form.name }
      : undefined,
    featured: form.featured,
    approved: form.approved,
    isSample: form.isSample,
    order: form.order,
  });

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await adminFetch<Testimonial>("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(payload()),
        });
        toast.success("Testimonial created");
        setDirty(false);
        router.replace(`/admin/testimonials/${created._id}`);
      } else {
        await adminFetch(`/api/admin/testimonials/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(payload()),
        });
        toast.success("Testimonial saved");
        setDirty(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-white/50">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {isNew ? "New testimonial" : "Edit testimonial"}
          </h2>
          <p className="text-sm text-white/45">
            Name, quote, and image update on the public testimonials page.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Role</label>
            <input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Organization</label>
            <input
              value={form.organization}
              onChange={(e) => set("organization", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Country</label>
            <input
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Quote</label>
          <textarea
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            rows={5}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <ImageUploadField
          label="Photo"
          value={form.imageUrl}
          folder="misc"
          onChange={(url) => set("imageUrl", url)}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.approved}
              onChange={(e) => set("approved", e.target.checked)}
            />
            Approved (public)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured
          </label>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value) || 0)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
