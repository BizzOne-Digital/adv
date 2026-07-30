"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { adminFetch } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types";

const STATUSES: InquiryStatus[] = ["new", "in-progress", "resolved", "archived"];

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (status) params.set("status", status);
      const data = await adminFetch<{ items: Inquiry[] }>(
        `/api/admin/inquiries?${params}`,
      );
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      void (async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({ limit: "100" });
          if (status) params.set("status", status);
          const data = await adminFetch<{ items: Inquiry[] }>(
            `/api/admin/inquiries?${params}`,
          );
          if (!cancelled) setItems(data.items);
        } catch (err) {
          if (!cancelled) {
            toast.error(err instanceof Error ? err.message : "Failed to load");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [status]);

  const updateStatus = async (id: string, next: InquiryStatus) => {
    try {
      await adminFetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      toast.success("Status updated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-white">Inquiries</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyAdminState title="No inquiries yet" />
      ) : (
        <DataTable
          rows={items}
          rowKey={(r) => r._id}
          columns={[
            {
              key: "name",
              header: "From",
              render: (r) => (
                <div>
                  <p className="font-medium">{r.fullName}</p>
                  <p className="text-xs text-white/40">{r.email}</p>
                </div>
              ),
            },
            { key: "type", header: "Type", render: (r) => r.inquiryType },
            {
              key: "subject",
              header: "Subject",
              render: (r) => r.subject || "—",
            },
            {
              key: "date",
              header: "Submitted",
              render: (r) => formatDate(r.createdAt, "MMM d, yyyy"),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <select
                  value={r.status}
                  onChange={(e) =>
                    void updateStatus(r._id, e.target.value as InquiryStatus)
                  }
                  className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (r) => (
                <Link
                  href={`/admin/inquiries/${r._id}`}
                  className="text-xs text-lime hover:underline"
                >
                  Detail
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
