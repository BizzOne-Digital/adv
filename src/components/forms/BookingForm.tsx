"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { FormField, TextInput, TextSelect, TextTextarea } from "@/components/ui/FormField";
import {
  bookingSchema,
  type BookingInput,
  bookingTypeSchema,
} from "@/lib/validations";
import { SERVICE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const BOOKING_TYPES = bookingTypeSchema.options.map((value) => ({
  value,
  label: value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

const INTEREST_OPTIONS = [
  ...SERVICE_LINKS.map((s) => s.label),
  "Events",
  "Training",
  "Partnerships",
  "Media",
];

export type BookingFormProps = {
  className?: string;
  defaultBookingType?: BookingInput["bookingType"];
};

export function BookingForm({ className, defaultBookingType }: BookingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BookingInput>({
    // zod v4 + RHF resolver typing can disagree on field name unions
    resolver: zodResolver(bookingSchema) as never,
    defaultValues: {
      bookingType: defaultBookingType ?? "general-meeting",
      consent: undefined,
      areasOfInterest: [],
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to submit booking.");
      }
      toast.success("Booking request received. We will follow up shortly.");
      reset({
        bookingType: defaultBookingType ?? "general-meeting",
        consent: undefined,
        areasOfInterest: [],
        website: "",
        fullName: "",
        organization: "",
        role: "",
        country: "",
        email: "",
        phone: "",
        preferredDate: undefined,
        preferredTime: "",
        timezone: "",
        message: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("relative space-y-5", className)} noValidate>
      {/* Honeypot */}
      <div className="sr-only" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          label="Full name"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextInput
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <TextInput
          label="Organization"
          error={errors.organization?.message}
          {...register("organization")}
        />
        <TextInput label="Role" error={errors.role?.message} {...register("role")} />
        <TextInput
          label="Country"
          required
          error={errors.country?.message}
          {...register("country")}
        />
        <TextInput label="Phone" error={errors.phone?.message} {...register("phone")} />
      </div>

      <TextSelect
        label="Booking type"
        required
        options={BOOKING_TYPES}
        error={errors.bookingType?.message}
        {...register("bookingType")}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <TextInput
          label="Preferred date"
          type="date"
          error={errors.preferredDate?.message}
          {...register("preferredDate")}
        />
        <TextInput
          label="Preferred time"
          type="time"
          error={errors.preferredTime?.message}
          {...register("preferredTime")}
        />
        <TextInput
          label="Time zone"
          placeholder="e.g. America/Toronto"
          error={errors.timezone?.message}
          {...register("timezone")}
        />
      </div>

      <FormField
        label="Areas of interest"
        name="areasOfInterest"
        hint="Select all that apply"
        error={errors.areasOfInterest?.message}
      >
        <Controller
          name="areasOfInterest"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-2">
              {INTEREST_OPTIONS.map((opt) => {
                const checked = field.value?.includes(opt) ?? false;
                return (
                  <label
                    key={opt}
                    className="flex min-w-0 items-start gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? (field.value ?? []).filter((v) => v !== opt)
                          : [...(field.value ?? []), opt];
                        field.onChange(next);
                      }}
                      className="accent-agri"
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
        />
      </FormField>

      <TextTextarea
        label="Message"
        required
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      <FormField label="Consent" name="consent" error={errors.consent?.message} required>
        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" className="mt-1 accent-agri" {...register("consent")} />
          <span>
            I consent to CAFBEX storing and processing this information to respond to my
            booking request. See our{" "}
            <a href="/privacy-policy" className="text-tech-blue underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </FormField>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Submitting…" : "Submit booking request"}
      </Button>
    </form>
  );
}

export default BookingForm;
