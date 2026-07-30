"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  HelpCircle,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Activity,
  Leaf,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Leaf },
  { href: "/admin/activities", label: "Activities", icon: Activity },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/pricing", label: "Pricing", icon: ShoppingBag },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/blogs", label: "Blog", icon: Newspaper },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/media", label: "Media", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#06261c] transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block" onClick={onClose}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
              CAFBEX
            </p>
            <p className="mt-1 text-sm text-white/70">Admin Portal</p>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-lime/15 text-lime"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-lime"
            onClick={onClose}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            View public site
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
