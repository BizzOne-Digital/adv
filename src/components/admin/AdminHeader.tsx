"use client";

import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export type AdminHeaderProps = {
  title: string;
  email?: string | null;
  onMenuClick?: () => void;
};

export function AdminHeader({ title, email, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#0B3D2E]/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-white sm:text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {email ? (
          <span className="hidden text-xs text-white/60 sm:inline">{email}</span>
        ) : null}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-lime/40 hover:text-lime"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
