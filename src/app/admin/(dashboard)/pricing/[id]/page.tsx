"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "pricing item",
        endpoint: "/api/admin/pricing",
        listPath: "/admin/pricing",
        statusKind: "active",
        nameLabel: "Title",
        extraFields: ["category", "priceVisibility"],
      }}
    />
  );
}
