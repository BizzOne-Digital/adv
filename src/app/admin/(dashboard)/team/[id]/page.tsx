"use client";

import { SimpleEntityEditor } from "@/components/admin/SimpleEntityEditor";

export default function Page() {
  return (
    <SimpleEntityEditor
      config={{
        title: "team member",
        endpoint: "/api/admin/team",
        listPath: "/admin/team",
        statusKind: "publish",
      }}
    />
  );
}
