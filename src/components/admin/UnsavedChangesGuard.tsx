"use client";

import { useEffect, useCallback } from "react";

export type UnsavedChangesGuardProps = {
  dirty: boolean;
  message?: string;
};

export function UnsavedChangesGuard({
  dirty,
  message = "You have unsaved changes. Leave this page?",
}: UnsavedChangesGuardProps) {
  const onBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = message;
    },
    [dirty, message],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [onBeforeUnload]);

  return null;
}

export default UnsavedChangesGuard;
