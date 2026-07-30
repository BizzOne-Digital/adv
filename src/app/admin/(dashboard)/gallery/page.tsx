"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceList } from "@/components/admin/ResourceList";
import type { GalleryItem } from "@/types";

export default function Page() {
  return (
    <ResourceList<GalleryItem>
      title="Gallery"
      endpoint="/api/admin/gallery"
      createHref="/admin/gallery/new"
      getEditHref={(r) => `/admin/gallery/${r._id}`}
      statusOptions={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.media?.url}
                alt=""
                className="h-10 w-10 rounded object-cover bg-black/30"
              />
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-white/40">{r.category}</p>
              </div>
            </div>
          ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
