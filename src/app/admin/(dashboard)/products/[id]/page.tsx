"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "product",
        endpoint: "/api/admin/products",
        listPath: "/admin/products",
        statusKind: "active",
        extraFields: ["category"],
      }}
    />
  );
}
