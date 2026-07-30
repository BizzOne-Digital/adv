"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "event",
        endpoint: "/api/admin/events",
        listPath: "/admin/events",
        statusKind: "publish",
        nameLabel: "Title",
        extraFields: ["category", "location"],
      }}
    />
  );
}
