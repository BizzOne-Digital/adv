"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { adminFetch } from "@/lib/admin-fetch";
import type { SiteSettings } from "@/types";

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<SiteSettings> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminFetch<SiteSettings>("/api/admin/settings");
        setForm(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load settings");
      }
    })();
  }, []);

  if (!form) return <p className="text-sm text-white/50">Loading settings…</p>;

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await adminFetch<SiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          organizationName: form.organizationName,
          shortName: form.shortName,
          logo: form.logo,
          favicon: form.favicon,
          primaryEmail: form.primaryEmail,
          secondaryEmail: form.secondaryEmail || "",
          phone: form.phone,
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: form.country,
          mapEmbed: form.mapEmbed,
          mission: form.mission,
          vision: form.vision,
          socialLinks: form.socialLinks,
          footerContent: form.footerContent,
          introEnabled: form.introEnabled ?? true,
          introText: form.introText,
          copyright: form.copyright,
          defaultSeo: form.defaultSeo,
          analyticsIds: form.analyticsIds,
          contactRecipient: form.contactRecipient,
          bookingRecipient: form.bookingRecipient,
          dataVerificationWarnings: form.dataVerificationWarnings || {
            postalCodePending: true,
            secondaryEmailPending: true,
          },
        }),
      });
      setForm(saved);
      setDirty(false);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Site settings</h2>
          <p className="text-sm text-white/45">
            Organization, contact, SEO, and verification flags
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-md bg-lime px-4 py-2 text-sm font-semibold text-forest disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      <Section title="Organization">
        <Field
          label="Organization name"
          value={form.organizationName || ""}
          onChange={(v) => set("organizationName", v)}
        />
        <Field
          label="Short name"
          value={form.shortName || ""}
          onChange={(v) => set("shortName", v)}
        />
        <Field label="Phone" value={form.phone || ""} onChange={(v) => set("phone", v)} />
        <Field
          label="Primary email"
          value={form.primaryEmail || ""}
          onChange={(v) => set("primaryEmail", v)}
        />
        <Field
          label="Secondary email"
          value={form.secondaryEmail || ""}
          onChange={(v) => set("secondaryEmail", v)}
        />
        <Field
          label="Contact recipient"
          value={form.contactRecipient || ""}
          onChange={(v) => set("contactRecipient", v)}
        />
        <Field
          label="Booking recipient"
          value={form.bookingRecipient || ""}
          onChange={(v) => set("bookingRecipient", v)}
        />
      </Section>

      <Section title="Social links">
        <Field
          label="LinkedIn"
          value={form.socialLinks?.linkedin || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, linkedin: v })
          }
        />
        <Field
          label="Facebook"
          value={form.socialLinks?.facebook || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, facebook: v })
          }
        />
        <Field
          label="Instagram"
          value={form.socialLinks?.instagram || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, instagram: v })
          }
        />
        <Field
          label="YouTube"
          value={form.socialLinks?.youtube || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, youtube: v })
          }
        />
        <Field
          label="X / Twitter"
          value={form.socialLinks?.twitter || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, twitter: v })
          }
        />
        <Field
          label="Website"
          value={form.socialLinks?.website || ""}
          onChange={(v) =>
            set("socialLinks", { ...form.socialLinks, website: v })
          }
        />
      </Section>

      <Section title="Address">
        <Field
          label="Address"
          value={form.address || ""}
          onChange={(v) => set("address", v)}
        />
        <Field label="City" value={form.city || ""} onChange={(v) => set("city", v)} />
        <Field
          label="Province"
          value={form.province || ""}
          onChange={(v) => set("province", v)}
        />
        <Field
          label="Postal code"
          value={form.postalCode || ""}
          onChange={(v) => set("postalCode", v)}
        />
        <Field
          label="Country"
          value={form.country || ""}
          onChange={(v) => set("country", v)}
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Map embed HTML"
            value={form.mapEmbed || ""}
            onChange={(v) => set("mapEmbed", v)}
          />
        </div>
      </Section>

      <Section title="Mission & vision">
        <div className="sm:col-span-2">
          <TextArea
            label="Mission"
            value={form.mission || ""}
            onChange={(v) => set("mission", v)}
            rows={4}
          />
        </div>
        <div className="sm:col-span-2">
          <TextArea
            label="Vision"
            value={form.vision || ""}
            onChange={(v) => set("vision", v)}
            rows={4}
          />
        </div>
      </Section>

      <Section title="Intro & footer">
        <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.introEnabled !== false}
            onChange={(e) => set("introEnabled", e.target.checked)}
          />
          Intro enabled
        </label>
        <Field
          label="Intro text"
          value={form.introText || ""}
          onChange={(v) => set("introText", v)}
        />
        <Field
          label="Copyright"
          value={form.copyright || ""}
          onChange={(v) => set("copyright", v)}
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Footer content"
            value={form.footerContent || ""}
            onChange={(v) => set("footerContent", v)}
          />
        </div>
      </Section>

      <Section title="Default SEO">
        <Field
          label="SEO title"
          value={form.defaultSeo?.title || ""}
          onChange={(v) =>
            set("defaultSeo", {
              title: v,
              description: form.defaultSeo?.description || "",
              ogImage: form.defaultSeo?.ogImage,
              keywords: form.defaultSeo?.keywords,
            })
          }
        />
        <div className="sm:col-span-2">
          <TextArea
            label="SEO description"
            value={form.defaultSeo?.description || ""}
            onChange={(v) =>
              set("defaultSeo", {
                title: form.defaultSeo?.title || "",
                description: v,
                ogImage: form.defaultSeo?.ogImage,
                keywords: form.defaultSeo?.keywords,
              })
            }
          />
        </div>
      </Section>

      <Section title="Data verification warnings">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.dataVerificationWarnings?.postalCodePending !== false}
            onChange={(e) =>
              set("dataVerificationWarnings", {
                postalCodePending: e.target.checked,
                secondaryEmailPending:
                  form.dataVerificationWarnings?.secondaryEmailPending ?? true,
              })
            }
          />
          Postal code pending verification
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={
              form.dataVerificationWarnings?.secondaryEmailPending !== false
            }
            onChange={(e) =>
              set("dataVerificationWarnings", {
                postalCodePending:
                  form.dataVerificationWarnings?.postalCodePending ?? true,
                secondaryEmailPending: e.target.checked,
              })
            }
          />
          Secondary email pending verification
        </label>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}
