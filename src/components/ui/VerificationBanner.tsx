import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationBannerProps = {
  postalUnverified?: boolean;
  emailUnverified?: boolean;
  secondaryEmail?: string;
  className?: string;
};

/**
 * Developer-facing warning when postal address or secondary email
 * have not been verified by the organization.
 */
export function VerificationBanner({
  postalUnverified,
  emailUnverified,
  secondaryEmail,
  className,
}: VerificationBannerProps) {
  if (!postalUnverified && !emailUnverified) return null;

  const notes: string[] = [];
  if (postalUnverified) {
    notes.push("Postal / mailing address has not been independently verified.");
  }
  if (emailUnverified) {
    notes.push(
      secondaryEmail
        ? `Secondary email (${secondaryEmail}) is unverified.`
        : "Secondary email address is unverified.",
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-wheat/40 bg-wheat/15 px-4 py-3 text-sm text-soil",
        className,
      )}
      role="status"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-wheat" aria-hidden />
      <div>
        <p className="font-semibold text-forest">Verification notice</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-relaxed sm:text-sm">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VerificationBanner;
