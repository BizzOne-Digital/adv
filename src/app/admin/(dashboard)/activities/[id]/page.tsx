"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "activity",
        endpoint: "/api/admin/activities",
        listPath: "/admin/activities",
        statusKind: "active",
        extraFields: ["location"],
      }}
    />
  );
}
