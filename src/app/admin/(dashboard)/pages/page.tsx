"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import { formatDate } from "@/lib/utils";
import type { Page } from "@/types";

export default function AdminPagesPage() {
  return (
    <ResourceList<Page>
      title="Pages"
      endpoint="/api/admin/pages"
      createHref="/admin/pages/new"
      createLabel="New page"
      getEditHref={(row) => `/admin/pages/${row.slug}`}
      getDeletePath={(row) => `/api/admin/pages/${row.slug}`}
      statusOptions={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
      emptyTitle="No pages yet"
      emptyDescription="Seed the database or create your first page."
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => (
            <div>
              <p className="font-medium text-white">{r.title}</p>
              <p className="text-xs text-white/40">/{r.slug === "home" ? "" : r.slug}</p>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          render: (r) => <StatusBadge status={r.status} />,
        },
        {
          key: "sections",
          header: "Sections",
          render: (r) => r.sections?.length ?? 0,
        },
        {
          key: "updated",
          header: "Updated",
          render: (r) => formatDate(r.updatedAt, "MMM d, yyyy"),
        },
      ]}
    />
  );
}
