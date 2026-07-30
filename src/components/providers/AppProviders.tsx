"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <SmoothScroll>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans",
            },
          }}
        />
      </SmoothScroll>
    </SessionProvider>
  );
}

export default AppProviders;
