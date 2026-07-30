"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export default function Page() {
  return (
    <ResourceList<BlogPost>
      title="Blog"
      endpoint="/api/admin/blogs"
      createHref="/admin/blogs/new"
      getEditHref={(r) => `/admin/blogs/${r._id}`}
      statusOptions={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
      emptyDescription="Draft posts are seeded but not published."
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
          key: "updated",
          header: "Updated",
          render: (r) => formatDate(r.updatedAt, "MMM d, yyyy"),
        },
      ]}
    />
  );
}
