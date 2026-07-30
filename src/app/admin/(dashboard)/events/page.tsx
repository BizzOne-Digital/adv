"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types";

export default function Page() {
  return (
    <ResourceList<Event>
      title="Events"
      endpoint="/api/admin/events"
      createHref="/admin/events/new"
      getEditHref={(r) => `/admin/events/${r._id}`}
      statusOptions={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
      emptyDescription="No published events are seeded by default."
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => (
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-white/40">{r.slug}</p>
            </div>
          ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
          key: "start",
          header: "Start",
          render: (r) => formatDate(r.startDate, "MMM d, yyyy"),
        },
      ]}
    />
  );
}
