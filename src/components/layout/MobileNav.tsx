"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CafbexLogo } from "@/components/brand/CafbexLogo";
import { PRIMARY_NAV, SERVICE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  organizationName?: string;
  servicesOpen: boolean;
  onToggleServices: () => void;
};

export function MobileNav({
  open,
  onClose,
  organizationName = "Canada–Africa Farmers Business Exchange",
  servicesOpen,
  onToggleServices,
}: MobileNavProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const duration = reduced ? 0 : 0.55;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration * 0.6 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <motion.div
            className="absolute inset-0 bg-forest"
            initial={reduced ? false : { clipPath: "circle(0% at 100% 0%)" }}
            animate={reduced ? undefined : { clipPath: "circle(150% at 100% 0%)" }}
            exit={reduced ? undefined : { clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 80%, rgba(198,255,78,0.25), transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(30,107,159,0.35), transparent 45%)",
              }}
            />

            <div className="relative flex h-full flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:px-5 sm:pb-8 sm:pt-4">
              <div className="flex items-center justify-between gap-3">
                <Link href="/" onClick={onClose} className="min-w-0 focus-visible:outline-none">
                  <CafbexLogo variant="full" size="sm" inverted />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/60 sm:mt-6 sm:text-sm">
                {organizationName}
              </p>

              <nav className="mt-6 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] sm:mt-8" data-lenis-prevent>
                <ul className="space-y-0.5 pb-4">
                  {PRIMARY_NAV.map((item, index) => {
                    if (item.href === "/services") {
                      return (
                        <li key={item.href}>
                          <button
                            type="button"
                            onClick={onToggleServices}
                            className="flex min-h-12 w-full items-center justify-between py-2.5 text-left text-xl font-medium tracking-tight sm:text-2xl"
                            aria-expanded={servicesOpen}
                          >
                            Services
                            <ChevronRight
                              className={cn(
                                "h-5 w-5 shrink-0 transition-transform",
                                servicesOpen && "rotate-90",
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {servicesOpen ? (
                              <motion.ul
                                initial={reduced ? false : { height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                className="overflow-hidden border-l border-lime/30 pl-4"
                              >
                                <li>
                                  <Link
                                    href="/services"
                                    onClick={onClose}
                                    className="block py-2.5 text-base text-lime"
                                  >
                                    All services
                                  </Link>
                                </li>
                                {SERVICE_LINKS.map((s) => (
                                  <li key={s.href}>
                                    <Link
                                      href={s.href}
                                      onClick={onClose}
                                      className="block py-2.5 text-[15px] leading-snug text-white/75 transition hover:text-white"
                                    >
                                      {s.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    }

                    return (
                      <motion.li
                        key={item.href}
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduced ? 0 : 0.08 + index * 0.04, duration }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block min-h-12 py-2.5 text-xl font-medium tracking-tight transition hover:text-lime sm:text-2xl"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <Link
                href="/booking"
                onClick={onClose}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-forest transition hover:bg-white sm:mt-4"
              >
                Book a Meeting
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileNav;
