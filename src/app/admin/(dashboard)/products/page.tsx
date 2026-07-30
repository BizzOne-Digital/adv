"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { Product } from "@/types";

export default function Page() {
  return (
    <ResourceList<Product>
      title="Products"
      endpoint="/api/admin/products"
      createHref="/admin/products/new"
      getEditHref={(r) => `/admin/products/${r._id}`}
      statusOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      emptyDescription="Seeded products stay inactive until you publish them."
      columns={[
        {
          key: "name",
          header: "Name",
          render: (r) => (
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-white/40">{r.category}</p>
            </div>
          ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
