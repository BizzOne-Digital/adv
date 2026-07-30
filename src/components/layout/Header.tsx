"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CafbexLogo } from "@/components/brand/CafbexLogo";
import { MobileNav } from "@/components/layout/MobileNav";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PRIMARY_NAV, SERVICE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type HeaderSettings = {
  organizationName?: string;
  shortName?: string;
};

export type HeaderProps = {
  settings?: HeaderSettings;
};

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServices, setDesktopServices] = useState(false);

  const organizationName =
    settings?.organizationName ?? "Canada–Africa Farmers Business Exchange";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMobileOpen(false);
      setServicesOpen(false);
      setDesktopServices(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-forest/10 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-forest/5 bg-[#eaf7f0]/85 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 pt-[env(safe-area-inset-top,0px)] sm:h-[4.5rem] sm:gap-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-10 min-w-0 shrink"
            aria-label={`${organizationName} home`}
          >
            <span className="block sm:hidden">
              <CafbexLogo variant="full" size="sm" />
            </span>
            <span className="hidden sm:block">
              <CafbexLogo variant="full" size="md" />
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {PRIMARY_NAV.map((item) => {
              if (item.href === "/services") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setDesktopServices(true)}
                    onMouseLeave={() => setDesktopServices(false)}
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition",
                        isActive("/services")
                          ? "bg-forest/8 text-forest"
                          : "text-foreground/75 hover:bg-forest/5 hover:text-forest",
                      )}
                      aria-expanded={desktopServices}
                      aria-haspopup="true"
                      onClick={() => setDesktopServices((v) => !v)}
                    >
                      Services
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          desktopServices && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {desktopServices ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 top-full z-50 w-[min(92vw,34rem)] -translate-x-1/2 pt-3"
                        >
                          <div className="rounded-2xl border border-border bg-white p-3 shadow-xl shadow-forest/10">
                            <Link
                              href="/services"
                              className="mb-2 block rounded-xl bg-surface px-3 py-2.5 text-sm font-semibold text-forest transition hover:bg-lime/40"
                            >
                              All services overview
                            </Link>
                            <ul className="grid gap-1 sm:grid-cols-2">
                              {SERVICE_LINKS.map((s) => (
                                <li key={s.href}>
                                  <Link
                                    href={s.href}
                                    className="block rounded-xl px-3 py-2.5 transition hover:bg-surface"
                                  >
                                    <span className="block text-sm font-medium text-forest">
                                      {s.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-muted">
                                      {s.description}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    isActive(item.href)
                      ? "bg-forest/8 text-forest"
                      : "text-foreground/75 hover:bg-forest/5 hover:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <MagneticButton
              href="/booking"
              className="hidden xl:inline-flex"
              variant="primary"
              size="sm"
            >
              Book a Meeting
            </MagneticButton>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 text-forest touch-manipulation xl:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        organizationName={organizationName}
        servicesOpen={servicesOpen}
        onToggleServices={() => setServicesOpen((v) => !v)}
      />
    </>
  );
}

export default Header;
