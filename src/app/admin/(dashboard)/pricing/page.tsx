"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { PricingItem } from "@/types";

export default function Page() {
  return (
    <ResourceList<PricingItem>
      title="Pricing"
      endpoint="/api/admin/pricing"
      createHref="/admin/pricing/new"
      getEditHref={(r) => `/admin/pricing/${r._id}`}
      statusOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => (
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-white/40">{r.category}</p>
            </div>
          ),
        },
        {
          key: "visibility",
          header: "Price",
          render: (r) => r.priceVisibility,
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
