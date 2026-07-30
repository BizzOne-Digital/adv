"use client";

import { useState, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export type AdminShellProps = {
  children: ReactNode;
  title: string;
  email?: string | null;
};

export function AdminShell({ children, title, email }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-[#041a13] text-white">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            title={title}
            email={email}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        toastOptions={{ classNames: { toast: "font-sans" } }}
      />
    </SessionProvider>
  );
}

export default AdminShell;
