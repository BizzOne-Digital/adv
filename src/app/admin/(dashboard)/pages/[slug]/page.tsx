"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { SectionEditor } from "@/components/admin/SectionEditor";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import { slugify } from "@/lib/utils";
import type { Page, PageSection } from "@/types";

const emptyPage = (): Partial<Page> => ({
  title: "",
  slug: "",
  summary: "",
  sections: [],
  status: "draft",
  seo: { title: "", description: "", ogImage: "", canonicalUrl: "", noIndex: false },
});

export default function PageEditorPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const isNew = params.slug === "new";
  const [form, setForm] = useState<Partial<Page>>(emptyPage());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<Page>(`/api/admin/pages/${params.slug}`);
        setForm(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, params.slug]);

  const update = <K extends keyof Page>(key: K, value: Page[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async (status?: "draft" | "published") => {
    setSaving(true);
    try {
      const payload = {
        title: form.title || "",
        slug: form.slug || slugify(form.title || "page"),
        summary: form.summary || "",
        sections: (form.sections || []).map((s, i) => ({
          ...s,
          order: i,
          visible: s.visible !== false,
        })),
        status: status || form.status || "draft",
        seo: form.seo,
        publishedAt: status === "published" ? new Date().toISOString() : form.publishedAt,
      };

      if (isNew) {
        const created = await adminFetch<Page>("/api/admin/pages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Page created");
        setDirty(false);
        router.replace(`/admin/pages/${created.slug}`);
      } else {
        await adminFetch(`/api/admin/pages/${params.slug}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success(status === "published" ? "Published" : "Saved");
        setDirty(false);
        if (payload.slug !== params.slug) {
          router.replace(`/admin/pages/${payload.slug}`);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-white/50">Loading…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {isNew ? "New page" : form.title || "Edit page"}
          </h2>
          <p className="text-sm text-white/45">Section editor with SEO and publish controls</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("draft")}
            className="rounded-md border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/5 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("published")}
            className="rounded-md bg-lime px-3 py-2 text-sm font-semibold text-forest hover:bg-lime/90 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <Field
          label="Title"
          value={form.title || ""}
          onChange={(v) => {
            update("title", v);
            if (isNew || !form.slug) update("slug", slugify(v));
          }}
        />
        <Field
          label="Slug"
          value={form.slug || ""}
          onChange={(v) => update("slug", slugify(v))}
        />
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-white/50">Summary</label>
          <textarea
            value={form.summary || ""}
            onChange={(e) => update("summary", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
      </div>

      <SectionEditor
        sections={(form.sections || []) as PageSection[]}
        onChange={(sections) => update("sections", sections)}
      />

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-semibold text-white">SEO</h3>
        <Field
          label="SEO title"
          value={form.seo?.title || ""}
          onChange={(v) => update("seo", { ...form.seo, title: v })}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">SEO description</label>
          <textarea
            value={form.seo?.description || ""}
            onChange={(e) =>
              update("seo", { ...form.seo, description: e.target.value })
            }
            rows={3}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <Field
          label="OG image URL"
          value={form.seo?.ogImage || ""}
          onChange={(v) => update("seo", { ...form.seo, ogImage: v })}
        />
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!form.seo?.noIndex}
            onChange={(e) =>
              update("seo", { ...form.seo, noIndex: e.target.checked })
            }
          />
          noIndex
        </label>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}
