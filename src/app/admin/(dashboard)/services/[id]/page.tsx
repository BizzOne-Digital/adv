"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import { slugify } from "@/lib/utils";
import type { Service } from "@/types";

type FormState = {
  name: string;
  slug: string;
  icon: string;
  summary: string;
  description: string;
  heroHeading: string;
  heroSubheading: string;
  purpose: string;
  intendedParticipants: string;
  potentialActivities: string;
  valueAreas: string;
  objectives: string;
  activities: string;
  status: "active" | "inactive";
  order: number;
  seoTitle: string;
  seoDescription: string;
};

const blank = (): FormState => ({
  name: "",
  slug: "",
  icon: "",
  summary: "",
  description: "",
  heroHeading: "",
  heroSubheading: "",
  purpose: "",
  intendedParticipants: "",
  potentialActivities: "",
  valueAreas: "",
  objectives: "",
  activities: "",
  status: "active",
  order: 0,
  seoTitle: "",
  seoDescription: "",
});

function lines(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ServiceEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const [form, setForm] = useState<FormState>(blank());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<Service>(`/api/admin/services/${params.id}`);
        setForm({
          name: data.name,
          slug: data.slug,
          icon: data.icon || "",
          summary: data.summary,
          description: data.description,
          heroHeading: data.heroHeading || "",
          heroSubheading: data.heroSubheading || "",
          purpose: data.purpose || "",
          intendedParticipants: (data.intendedParticipants || []).join("\n"),
          potentialActivities: (data.potentialActivities || []).join("\n"),
          valueAreas: (data.valueAreas || []).join("\n"),
          objectives: (data.objectives || []).join("\n"),
          activities: (data.activities || []).join("\n"),
          status: data.status,
          order: data.order,
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

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        icon: form.icon || undefined,
        summary: form.summary,
        description: form.description,
        heroHeading: form.heroHeading || undefined,
        heroSubheading: form.heroSubheading || undefined,
        purpose: form.purpose || undefined,
        intendedParticipants: lines(form.intendedParticipants),
        potentialActivities: lines(form.potentialActivities),
        valueAreas: lines(form.valueAreas),
        objectives: lines(form.objectives),
        activities: lines(form.activities),
        status: form.status,
        order: Number(form.order) || 0,
        seo: {
          title: form.seoTitle || undefined,
          description: form.seoDescription || undefined,
        },
      };

      if (isNew) {
        const created = await adminFetch<Service>("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Service created");
        setDirty(false);
        router.replace(`/admin/services/${created._id}`);
      } else {
        await adminFetch(`/api/admin/services/${params.id}`, {
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

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">
          {isNew ? "New service" : form.name || "Edit service"}
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
        <Input label="Name" value={form.name} onChange={(v) => {
          set("name", v);
          if (isNew) set("slug", slugify(v));
        }} />
        <Input label="Slug" value={form.slug} onChange={(v) => set("slug", slugify(v))} />
        <Input label="Icon" value={form.icon} onChange={(v) => set("icon", v)} />
        <Input label="Order" type="number" value={String(form.order)} onChange={(v) => set("order", Number(v) || 0)} />
        <Select
          label="Status"
          value={form.status}
          onChange={(v) => set("status", v as FormState["status"])}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <div className="sm:col-span-2">
          <TextArea label="Summary" value={form.summary} onChange={(v) => set("summary", v)} rows={2} />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Description" value={form.description} onChange={(v) => set("description", v)} rows={5} />
        </div>
        <Input label="Hero heading" value={form.heroHeading} onChange={(v) => set("heroHeading", v)} />
        <Input label="Hero subheading" value={form.heroSubheading} onChange={(v) => set("heroSubheading", v)} />
        <div className="sm:col-span-2">
          <TextArea label="Purpose" value={form.purpose} onChange={(v) => set("purpose", v)} rows={3} />
        </div>
        <TextArea label="Intended participants (one per line)" value={form.intendedParticipants} onChange={(v) => set("intendedParticipants", v)} />
        <TextArea label="Potential activities (one per line)" value={form.potentialActivities} onChange={(v) => set("potentialActivities", v)} />
        <TextArea label="Value areas (one per line)" value={form.valueAreas} onChange={(v) => set("valueAreas", v)} />
        <TextArea label="Objectives (one per line)" value={form.objectives} onChange={(v) => set("objectives", v)} />
        <div className="sm:col-span-2">
          <TextArea label="Activities (one per line)" value={form.activities} onChange={(v) => set("activities", v)} />
        </div>
        <Input label="SEO title" value={form.seoTitle} onChange={(v) => set("seoTitle", v)} />
        <Input label="SEO description" value={form.seoDescription} onChange={(v) => set("seoDescription", v)} />
      </div>
    </div>
  );
}

function Input({
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

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
