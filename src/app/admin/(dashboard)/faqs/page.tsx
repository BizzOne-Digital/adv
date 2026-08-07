"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { FAQ } from "@/types";

export default function Page() {
  return (
    <ResourceList<FAQ>
      title="FAQs"
      endpoint="/api/admin/faqs"
      createHref="/admin/faqs/new"
      getEditHref={(r) => `/admin/faqs/${r._id}`}
      statusOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      columns={[
        {
          key: "question",
          header: "Question",
          render: (r) => (
            <div>
              <p className="font-medium line-clamp-2">{r.question}</p>
              <p className="text-xs text-white/40">{r.category}</p>
            </div>
          ),
        },
        {
          key: "order",
          header: "Order",
          render: (r) => r.order,
        },
        {
          key: "status",
          header: "Status",
          render: (r) => <StatusBadge status={r.status} />,
        },
      ]}
    />
  );
}
