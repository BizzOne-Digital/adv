"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import type { UploadFolder } from "@/models/StoredUpload";
import { slugify } from "@/lib/utils";

type SimpleEntityConfig = {
  title: string;
  endpoint: string;
  listPath: string;
  statusKind: "publish" | "active";
  nameLabel?: string;
  extraFields?: Array<"category" | "location" | "excerpt" | "priceVisibility">;
};

export function SimpleEntityEditor({ config }: { config: SimpleEntityConfig }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const nameKey = config.nameLabel === "Title" ? "title" : "name";

  const [form, setForm] = useState({
    name: "",
    title: "",
    slug: "",
    summary: "",
    excerpt: "",
    description: "",
    category: "",
    location: "",
    status: config.statusKind === "publish" ? "draft" : "active",
    order: 0,
    featured: false,
    priceVisibility: "contact",
    startDate: "",
    mediaUrl: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<Record<string, unknown>>(
          `${config.endpoint}/${params.id}`,
        );
        setForm((prev) => ({
          ...prev,
          name: String(data.name || ""),
          title: String(data.title || ""),
          slug: String(data.slug || ""),
          summary: String(
            data.summary ||
              (config.endpoint.includes("/team") ? data.role : "") ||
              "",
          ),
          excerpt: String(data.excerpt || ""),
          description: String(
            data.description ||
              data.bio ||
              data.quote ||
              "",
          ),
          category: String(data.category || ""),
          location: String(data.location || ""),
          status: String(
            config.endpoint.includes("/testimonials")
              ? data.approved
                ? "active"
                : "inactive"
              : data.status || prev.status,
          ),
          order: Number(data.order || 0),
          featured: Boolean(
            data.featured ||
              (config.endpoint.includes("/team") ? data.isLeadership : false),
          ),
          priceVisibility: String(data.priceVisibility || "contact"),
          startDate: data.startDate
            ? new Date(String(data.startDate)).toISOString().slice(0, 16)
            : "",
          mediaUrl: (() => {
            if (
              data.media &&
              typeof data.media === "object" &&
              "url" in (data.media as object)
            ) {
              return String((data.media as { url: string }).url);
            }
            if (Array.isArray(data.images) && data.images[0]) {
              const first = data.images[0] as { url?: string };
              return String(first.url || "");
            }
            if (
              data.image &&
              typeof data.image === "object" &&
              "url" in (data.image as object)
            ) {
              return String((data.image as { url: string }).url);
            }
            if (
              data.coverImage &&
              typeof data.coverImage === "object" &&
              "url" in (data.coverImage as object)
            ) {
              return String((data.coverImage as { url: string }).url);
            }
            return "";
          })(),
        }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [config.endpoint, isNew, params.id]);

  const save = async () => {
    setSaving(true);
    try {
      const displayName = nameKey === "title" ? form.title : form.name;
      const payload: Record<string, unknown> = {
        [nameKey]: displayName,
        slug: form.slug || slugify(displayName),
        description: form.description || form.summary || "Content pending.",
        status: form.status,
        order: form.order,
      };

      if (form.summary || config.endpoint.includes("/activities") || config.endpoint.includes("/events") || config.endpoint.includes("/products") || config.endpoint.includes("/gallery")) {
        payload.summary = form.summary || form.excerpt || form.description.slice(0, 200) || "Summary pending.";
      }
      if (config.extraFields?.includes("excerpt") || config.endpoint.includes("/blogs")) {
        payload.excerpt = form.excerpt || form.summary || "Excerpt pending.";
        payload.content = form.description;
        payload.title = form.title;
      }
      if (config.extraFields?.includes("category")) payload.category = form.category || "General";
      if (config.extraFields?.includes("location")) payload.location = form.location || undefined;
      if (config.extraFields?.includes("priceVisibility")) {
        payload.priceVisibility = form.priceVisibility;
        payload.title = form.title;
        payload.cta = { label: "Contact for details", href: "/contact" };
      }
      if (config.endpoint.includes("/events")) {
        payload.title = form.title;
        payload.startDate = form.startDate || new Date().toISOString();
        payload.featured = form.featured;
      }
      if (config.endpoint.includes("/gallery")) {
        payload.title = form.title;
        payload.category = form.category || "General";
        payload.mediaType = "image";
        if (!form.mediaUrl) {
          throw new Error("Please upload a gallery image before saving.");
        }
        payload.media = {
          url: form.mediaUrl,
          alt: form.title,
        };
        payload.featured = form.featured;
      }
      if (config.endpoint.includes("/team")) {
        payload.role = form.summary || "Team member";
        payload.bio = form.description;
        payload.isLeadership = form.featured;
        if (form.mediaUrl) {
          payload.image = { url: form.mediaUrl, alt: form.name };
        }
      }
      if (config.endpoint.includes("/products")) {
        payload.name = form.name;
        payload.category = form.category || "General";
        payload.featured = form.featured;
        if (form.mediaUrl) {
          payload.images = [{ url: form.mediaUrl, alt: form.name }];
        }
      }
      if (config.endpoint.includes("/events") && form.mediaUrl) {
        payload.images = [{ url: form.mediaUrl, alt: form.title }];
      }
      if (config.endpoint.includes("/blogs") && form.mediaUrl) {
        payload.coverImage = { url: form.mediaUrl, alt: form.title };
      }
      if (config.endpoint.includes("/activities") && form.mediaUrl) {
        payload.images = [{ url: form.mediaUrl, alt: form.name || form.title }];
      }
      if (config.endpoint.includes("/testimonials")) {
        payload.name = form.name;
        payload.quote = form.description;
        payload.approved = form.status === "active";
        payload.featured = form.featured;
        payload.isSample = false;
        if (form.mediaUrl) {
          payload.image = { url: form.mediaUrl, alt: form.name };
        }
        delete payload.status;
        delete payload.slug;
        delete payload.description;
      }

      if (isNew) {
        const created = await adminFetch<{ _id: string }>(config.endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Created");
        setDirty(false);
        router.replace(`${config.listPath}/${created._id}`);
      } else {
        await adminFetch(`${config.endpoint}/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Saved");
        setDirty(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-white/50">Loading…</p>;

  const label = nameKey === "title" ? "Title" : "Name";
  const value = nameKey === "title" ? form.title : form.name;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {isNew ? `New ${config.title}` : value || `Edit ${config.title}`}
        </h2>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <Field
          label={label}
          value={value}
          onChange={(v) => {
            setForm((p) => ({
              ...p,
              [nameKey]: v,
              slug: isNew ? slugify(v) : p.slug,
            }));
            setDirty(true);
          }}
        />
        {!config.endpoint.includes("/testimonials") ? (
          <Field
            label="Slug"
            value={form.slug}
            onChange={(v) => {
              setForm((p) => ({ ...p, slug: slugify(v) }));
              setDirty(true);
            }}
          />
        ) : null}
        {config.extraFields?.includes("category") ? (
          <Field
            label="Category"
            value={form.category}
            onChange={(v) => {
              setForm((p) => ({ ...p, category: v }));
              setDirty(true);
            }}
          />
        ) : null}
        {config.extraFields?.includes("location") ? (
          <Field
            label="Location"
            value={form.location}
            onChange={(v) => {
              setForm((p) => ({ ...p, location: v }));
              setDirty(true);
            }}
          />
        ) : null}
        {config.endpoint.includes("/events") ? (
          <Field
            label="Start date"
            type="datetime-local"
            value={form.startDate}
            onChange={(v) => {
              setForm((p) => ({ ...p, startDate: v }));
              setDirty(true);
            }}
          />
        ) : null}
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Status</label>
          <select
            value={form.status}
            onChange={(e) => {
              setForm((p) => ({ ...p, status: e.target.value }));
              setDirty(true);
            }}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          >
            {config.statusKind === "publish" ? (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </>
            ) : (
              <>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </>
            )}
          </select>
        </div>
        <Field
          label="Order"
          type="number"
          value={String(form.order)}
          onChange={(v) => {
            setForm((p) => ({ ...p, order: Number(v) || 0 }));
            setDirty(true);
          }}
        />
        {shouldShowImageUpload(config.endpoint) ? (
          <div className="sm:col-span-2">
            <ImageUploadField
              label={imageLabelFor(config.endpoint)}
              folder={folderFor(config.endpoint)}
              value={form.mediaUrl}
              alt={value}
              onChange={(url) => {
                setForm((p) => ({ ...p, mediaUrl: url }));
                setDirty(true);
              }}
            />
          </div>
        ) : null}
        {config.extraFields?.includes("priceVisibility") ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Price visibility
            </label>
            <select
              value={form.priceVisibility}
              onChange={(e) => {
                setForm((p) => ({ ...p, priceVisibility: e.target.value }));
                setDirty(true);
              }}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            >
              <option value="contact">Contact for details</option>
              <option value="amount">Show amount</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-white/50">
            {config.endpoint.includes("/testimonials")
              ? "Quote"
              : config.endpoint.includes("/team")
                ? "Role / summary"
                : "Summary"}
          </label>
          <textarea
            value={
              config.endpoint.includes("/testimonials")
                ? form.description
                : form.summary
            }
            onChange={(e) => {
              const v = e.target.value;
              setForm((p) =>
                config.endpoint.includes("/testimonials")
                  ? { ...p, description: v }
                  : { ...p, summary: v },
              );
              setDirty(true);
            }}
            rows={3}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        {!config.endpoint.includes("/testimonials") ? (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-white/50">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => {
                setForm((p) => ({ ...p, description: e.target.value }));
                setDirty(true);
              }}
              rows={6}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => {
              setForm((p) => ({ ...p, featured: e.target.checked }));
              setDirty(true);
            }}
          />
          Featured / leadership
        </label>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}

function shouldShowImageUpload(endpoint: string): boolean {
  return (
    endpoint.includes("/gallery") ||
    endpoint.includes("/products") ||
    endpoint.includes("/team") ||
    endpoint.includes("/events") ||
    endpoint.includes("/blogs") ||
    endpoint.includes("/testimonials") ||
    endpoint.includes("/activities")
  );
}

function folderFor(endpoint: string): UploadFolder {
  if (endpoint.includes("/gallery")) return "gallery";
  if (endpoint.includes("/products")) return "products";
  if (endpoint.includes("/pages")) return "pages";
  return "misc";
}

function imageLabelFor(endpoint: string): string {
  if (endpoint.includes("/gallery")) return "Gallery image";
  if (endpoint.includes("/products")) return "Product image";
  if (endpoint.includes("/team")) return "Portrait";
  if (endpoint.includes("/blogs")) return "Cover image";
  if (endpoint.includes("/events")) return "Event image";
  if (endpoint.includes("/testimonials")) return "Photo";
  return "Image";
}
