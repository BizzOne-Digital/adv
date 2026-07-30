"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { TeamMember } from "@/types";

export default function Page() {
  return (
    <ResourceList<TeamMember>
      title="Team"
      endpoint="/api/admin/team"
      createHref="/admin/team/new"
      getEditHref={(r) => `/admin/team/${r._id}`}
      statusOptions={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
      emptyDescription="Team placeholders are seeded as drafts only."
      columns={[
        {
          key: "name",
          header: "Name",
          render: (r) => (
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-white/40">{r.role}</p>
            </div>
          ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
