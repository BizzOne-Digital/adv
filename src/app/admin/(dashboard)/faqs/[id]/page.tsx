"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import type { FAQ } from "@/types";

export default function FaqEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "General",
    status: "active" as "active" | "inactive",
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const data = await adminFetch<FAQ>(`/api/admin/faqs/${params.id}`);
        setForm({
          question: data.question,
          answer: data.answer,
          category: data.category,
          status: data.status,
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

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await adminFetch<FAQ>("/api/admin/faqs", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("FAQ created");
        setDirty(false);
        router.replace(`/admin/faqs/${created._id}`);
      } else {
        await adminFetch(`/api/admin/faqs/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("FAQ saved");
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
            {isNew ? "New FAQ" : "Edit FAQ"}
          </h2>
          <p className="text-sm text-white/45">
            Questions and answers appear on the public FAQ page.
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
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Question</label>
          <input
            value={form.question}
            onChange={(e) => set("question", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) => set("answer", e.target.value)}
            rows={8}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Category</label>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as "active" | "inactive")}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
