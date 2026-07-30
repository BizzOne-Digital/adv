"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types";

export default function BlogEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "<p></p>",
    authorName: "CAFBEX",
    tags: "",
    featured: false,
    status: "draft" as "draft" | "published",
    seoTitle: "",
    seoDescription: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<BlogPost>(`/api/admin/blogs/${params.id}`);
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          authorName: data.authorName || "CAFBEX",
          tags: (data.tags || []).join(", "),
          featured: data.featured,
          status: data.status,
          seoTitle: data.seo?.title || "",
          seoDescription: data.seo?.description || "",
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, params.id]);

  const save = async (status?: "draft" | "published") => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        authorName: form.authorName,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured: form.featured,
        status: status || form.status,
        seo: {
          title: form.seoTitle || undefined,
          description: form.seoDescription || undefined,
        },
      };

      if (isNew) {
        const created = await adminFetch<BlogPost>("/api/admin/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Created");
        setDirty(false);
        router.replace(`/admin/blogs/${created._id}`);
      } else {
        await adminFetch(`/api/admin/blogs/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success(status === "published" ? "Published" : "Saved");
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
    <div className="mx-auto max-w-4xl space-y-5">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-white">
          {isNew ? "New blog post" : form.title || "Edit post"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("draft")}
            className="rounded-md border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("published")}
            className="rounded-md bg-lime px-3 py-2 text-sm font-semibold text-forest"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/50">Title</label>
          <input
            value={form.title}
            onChange={(e) => {
              const v = e.target.value;
              setForm((p) => ({
                ...p,
                title: v,
                slug: isNew ? slugify(v) : p.slug,
              }));
              setDirty(true);
            }}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setForm((p) => ({ ...p, slug: slugify(e.target.value) }));
              setDirty(true);
            }}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-white/50">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => {
              setForm((p) => ({ ...p, excerpt: e.target.value }));
              setDirty(true);
            }}
            rows={2}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Author</label>
          <input
            value={form.authorName}
            onChange={(e) => {
              setForm((p) => ({ ...p, authorName: e.target.value }));
              setDirty(true);
            }}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(e) => {
              setForm((p) => ({ ...p, tags: e.target.value }));
              setDirty(true);
            }}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => {
              setForm((p) => ({ ...p, featured: e.target.checked }));
              setDirty(true);
            }}
          />
          Featured
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-white/50">Content</label>
        <RichTextEditor
          value={form.content}
          onChange={(html) => {
            setForm((p) => ({ ...p, content: html }));
            setDirty(true);
          }}
        />
      </div>
    </div>
  );
}
