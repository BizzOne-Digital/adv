"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { Activity } from "@/types";

export default function Page() {
  return (
    <ResourceList<Activity>
      title="Activities"
      endpoint="/api/admin/activities"
      createHref="/admin/activities/new"
      getEditHref={(r) => `/admin/activities/${r._id}`}
      statusOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (r) => (
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-white/40">{r.slug}</p>
            </div>
          ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "order", header: "Order", render: (r) => r.order },
      ]}
    />
  );
}
