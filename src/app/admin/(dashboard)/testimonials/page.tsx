"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-fetch";
import type { Testimonial } from "@/types";

export default function Page() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ items: Testimonial[] }>(
        "/api/admin/testimonials?limit=100",
      );
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (row: Testimonial, patchData: Partial<Testimonial>) => {
    try {
      await adminFetch(`/api/admin/testimonials/${row._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: row.name,
          role: row.role,
          organization: row.organization,
          country: row.country,
          quote: row.quote,
          image: row.image,
          featured: patchData.featured ?? row.featured,
          approved: patchData.approved ?? row.approved,
          isSample: row.isSample,
          order: row.order,
        }),
      });
      toast.success("Updated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      toast.success("Deleted");
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Testimonials</h2>
          <p className="mt-1 text-sm text-white/45">
            Add, edit, approve, and feature quotes shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest"
        >
          Add testimonial
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyAdminState
          title="No testimonials"
          description="Create a testimonial to show quotes on the home and testimonials pages."
          action={
            <Link
              href="/admin/testimonials/new"
              className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest"
            >
              Add testimonial
            </Link>
          }
        />
      ) : (
        <DataTable
          rows={items}
          rowKey={(r) => r._id}
          columns={[
            {
              key: "name",
              header: "Person",
              render: (r) => (
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-white/40">
                    {[r.role, r.organization].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ),
            },
            {
              key: "quote",
              header: "Quote",
              render: (r) => (
                <p className="max-w-md truncate text-white/70">{r.quote}</p>
              ),
            },
            {
              key: "approved",
              header: "Status",
              render: (r) => (
                <StatusBadge status={r.approved ? "active" : "inactive"} />
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/testimonials/${r._id}`}
                    className="text-xs text-lime hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-xs text-white/60 hover:text-white"
                    onClick={() => void patch(r, { approved: !r.approved })}
                  >
                    {r.approved ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-white/60 hover:text-white"
                    onClick={() => void patch(r, { featured: !r.featured })}
                  >
                    {r.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-300 hover:text-red-200"
                    onClick={() => setDeleteId(r._id)}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete testimonial?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => void remove()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
