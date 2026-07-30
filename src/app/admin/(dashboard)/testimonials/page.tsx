"use client";

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
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      void (async () => {
        setLoading(true);
        try {
          const data = await adminFetch<{ items: Testimonial[] }>(
            "/api/admin/testimonials?limit=100",
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
  }, []);

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

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Testimonials</h2>
        <p className="mt-1 text-sm text-white/45">
          Approve and feature authentic quotes. Nothing is seeded as published.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyAdminState
          title="No testimonials"
          description="When submissions arrive, approve them here before they appear publicly."
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
                  <p className="line-clamp-2 text-xs text-white/45">{r.quote}</p>
                </div>
              ),
            },
            {
              key: "approved",
              header: "Approved",
              render: (r) => (
                <StatusBadge status={r.approved ? "approved" : "pending"} />
              ),
            },
            {
              key: "featured",
              header: "Featured",
              render: (r) => (r.featured ? "Yes" : "No"),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (r) => (
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    className="text-lime hover:underline"
                    onClick={() => void patch(r, { approved: !r.approved })}
                  >
                    {r.approved ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="text-white/70 hover:underline"
                    onClick={() => void patch(r, { featured: !r.featured })}
                  >
                    {r.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    className="text-red-300 hover:underline"
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
        open={!!deleteId}
        title="Delete testimonial?"
        description="This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await adminFetch(`/api/admin/testimonials/${deleteId}`, {
              method: "DELETE",
            });
            toast.success("Deleted");
            setDeleteId(null);
            await load();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
          }
        }}
      />
    </div>
  );
}
