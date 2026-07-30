"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { adminFetch } from "@/lib/admin-fetch";

export type ResourceListProps<T extends { _id: string }> = {
  title: string;
  endpoint: string;
  getEditHref: (row: T) => string;
  getDeletePath?: (row: T) => string;
  createHref?: string;
  createLabel?: string;
  columns: Column<T>[];
  searchPlaceholder?: string;
  statusOptions?: { value: string; label: string }[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ResourceList<T extends { _id: string }>({
  title,
  endpoint,
  getEditHref,
  getDeletePath,
  createHref,
  createLabel = "Add new",
  columns,
  searchPlaceholder = "Search…",
  statusOptions,
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: ResourceListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteRow, setDeleteRow] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      const data = await adminFetch<{ items: T[] }>(`${endpoint}?${params}`);
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [endpoint, q, status]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 200);
    return () => clearTimeout(t);
  }, [load]);

  const resolvedColumns: Column<T>[] = [
    ...columns,
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link
            href={getEditHref(row)}
            className="text-xs font-medium text-lime hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteRow(row)}
            className="text-white/40 hover:text-red-300"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex items-center gap-2 rounded-md bg-lime px-3 py-2 text-sm font-semibold text-forest hover:bg-lime/90"
          >
            <Plus className="h-4 w-4" />
            {createLabel}
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-lime/40 focus:outline-none"
          />
        </div>
        {statusOptions ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
          >
            <option value="">All statuses</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyAdminState
          title={emptyTitle}
          description={emptyDescription}
          action={
            createHref ? (
              <Link
                href={createHref}
                className="inline-flex items-center gap-2 rounded-md bg-lime px-3 py-2 text-sm font-semibold text-forest"
              >
                <Plus className="h-4 w-4" />
                {createLabel}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <DataTable columns={resolvedColumns} rows={items} rowKey={(r) => r._id} />
      )}

      <ConfirmDialog
        open={!!deleteRow}
        title="Delete this record?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteRow(null)}
        onConfirm={async () => {
          if (!deleteRow) return;
          setDeleting(true);
          try {
            const path =
              getDeletePath?.(deleteRow) || `${endpoint}/${deleteRow._id}`;
            await adminFetch(path, { method: "DELETE" });
            toast.success("Deleted");
            setDeleteRow(null);
            await load();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}

export default ResourceList;
