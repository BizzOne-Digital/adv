"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types";

export default function InquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminFetch<Inquiry>(`/api/admin/inquiries/${params.id}`);
        setInquiry(data);
        setNotes(data.adminNotes || "");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, [params.id]);

  if (!inquiry) return <p className="text-sm text-white/50">Loading…</p>;

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminFetch<Inquiry>(`/api/admin/inquiries/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: inquiry.status, adminNotes: notes }),
      });
      setInquiry(updated);
      toast.success("Updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{inquiry.fullName}</h2>
          <p className="text-sm text-white/45">{inquiry.email}</p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm sm:grid-cols-2">
        <Info label="Organization" value={inquiry.organization} />
        <Info label="Country" value={inquiry.country} />
        <Info label="Phone" value={inquiry.phone} />
        <Info label="Type" value={inquiry.inquiryType} />
        <Info label="Subject" value={inquiry.subject} />
        <Info label="Submitted" value={formatDate(inquiry.createdAt, "PPpp")} />
        <div className="sm:col-span-2">
          <Info label="Message" value={inquiry.message} />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <label className="block text-xs font-medium text-white/50">Status</label>
        <select
          value={inquiry.status}
          onChange={(e) =>
            setInquiry({ ...inquiry, status: e.target.value as InquiryStatus })
          }
          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
        >
          {["new", "in-progress", "resolved", "archived"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="block text-xs font-medium text-white/50">Admin notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
        />
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-0.5 text-white/85">{value || "—"}</p>
    </div>
  );
}
