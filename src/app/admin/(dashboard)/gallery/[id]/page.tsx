"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "gallery item",
        endpoint: "/api/admin/gallery",
        listPath: "/admin/gallery",
        statusKind: "publish",
        nameLabel: "Title",
        extraFields: ["category", "location"],
      }}
    />
  );
}
