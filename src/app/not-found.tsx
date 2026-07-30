import Link from "next/link";
import { CafbexLogo } from "@/components/brand/CafbexLogo";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-forest text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(198,255,78,0.2), transparent 45%), radial-gradient(ellipse at 80% 70%, rgba(30,107,159,0.35), transparent 40%)",
        }}
      />
      <Container className="relative py-24 text-center">
        <div className="mx-auto flex justify-center">
          <CafbexLogo variant="full" size="lg" inverted />
        </div>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-lime">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-white/75">
          This path is not cultivated yet. Return home or explore services and contact options.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton href="/" variant="lime" size="lg">
            Go home
          </MagneticButton>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            Contact
          </Link>
        </div>
      </Container>
    </div>
  );
}
